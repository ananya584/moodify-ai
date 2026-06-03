const axios = require('axios');

let spotifyAccessToken = null;
let tokenExpireTime = 0;

const SEARCH_FETCH_LIMIT = 10;
const MAX_RETRY_DELAY_MS = 10_000; // Never wait more than 10 seconds per retry

// ─── Rate limiting helpers ────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(fn, retries = 3, baseDelayMs = 1000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const status = error.response?.status;
      const isRateLimit = status === 429;
      const isServerError = status >= 500;

      if ((isRateLimit || isServerError) && attempt < retries) {
        const retryAfterHeader = parseInt(error.response?.headers?.['retry-after'] || '0', 10);
        const retryAfterMs = retryAfterHeader > 0 ? retryAfterHeader * 1000 : 0;
        const backoffMs = baseDelayMs * Math.pow(2, attempt);

        // Cap the delay — Spotify sometimes returns absurdly large retry-after values
        const delay = Math.min(
          retryAfterMs > 0 ? retryAfterMs : backoffMs,
          MAX_RETRY_DELAY_MS,
        );

        console.log(`[Spotify] ${status} — retrying in ${delay}ms (attempt ${attempt + 1}/${retries})`);
        await sleep(delay);
        continue;
      }

      if (status === 429) {
        throw new Error('Spotify rate limit exceeded. Please try again in a moment.');
      }
      throw error;
    }
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function getAccessToken() {
  const now = Date.now();

  if (spotifyAccessToken && now < tokenExpireTime) {
    return spotifyAccessToken;
  }

  const auth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
  ).toString('base64');

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  spotifyAccessToken = response.data.access_token;
  tokenExpireTime = now + response.data.expires_in * 1000 - 60000;

  return spotifyAccessToken;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripHtml(text) {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').trim();
}

function isOfficialCurator(ownerName) {
  const name = (ownerName || '').toLowerCase();
  return (
    name.includes('spotify') ||
    name.includes('apple') ||
    name.includes('sony') ||
    name.includes('universal') ||
    name.includes('warner') ||
    name.includes('t-series') ||
    name.includes('tips')
  );
}

/**
 * Quality score using only search-available data (no follower count needed).
 * Official curators get a large boost; image + real description add smaller signals.
 */
function qualityScore(playlist) {
  const officialBoost = isOfficialCurator(playlist.owner) ? 1000 : 0;
  const hasImage = playlist.image ? 50 : 0;
  const hasDescription = playlist.description && playlist.description !== 'Curated on Spotify' ? 30 : 0;
  return officialBoost + hasImage + hasDescription;
}

/**
 * Map a raw Spotify search item to our internal shape.
 * All data comes from the search response — no extra API calls needed.
 */
function mapSearchItem(p) {
  const ownerName = p.owner?.display_name || p.owner?.id || 'Spotify';
  return {
    id: p.id,
    name: p.name,
    description: stripHtml(p.description) || 'Curated on Spotify',
    image: p.images?.[0]?.url || null,
    owner: ownerName,
    spotifyUrl: p.external_urls?.spotify || `https://open.spotify.com/playlist/${p.id}`,
    spotifyAppUrl: `spotify:playlist:${p.id}`,
  };
}

// ─── Search (1 API call per query, no per-playlist detail fetching) ───────────

async function rawSearchPlaylists(query) {
  return await withRetry(async () => {
    const token = await getAccessToken();

    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q: query,
        type: 'playlist',
        limit: SEARCH_FETCH_LIMIT,
      },
    });

    return (response.data.playlists?.items || []).filter(
      (p) => p?.id && p?.name && p?.images?.length,
    );
  });
}

/**
 * Search and rank playlists using only search endpoint data.
 * Previously: 1 search + N detail calls (caused 429s).
 * Now: 1 search call, done.
 */
async function searchAndRankPlaylists(query, limit = 10) {
  try {
    const items = await rawSearchPlaylists(query);
    if (items.length === 0) return [];

    return items
      .map(mapSearchItem)
      .sort((a, b) => qualityScore(b) - qualityScore(a))
      .slice(0, limit);
  } catch (error) {
    console.error(`Search failed for "${query}":`, error.response?.data || error.message);
    return [];
  }
}

function generateSearchVariations(query) {
  const words = query.split(/\s+/).filter(Boolean);
  const variations = [];

  if (words.length > 2) {
    variations.push(words.slice(0, 2).join(' '));
    variations.push(`${words[0]} playlist`);
  }
  if (words.length > 1) {
    variations.push(`${words[words.length - 1]} playlist`);
  }

  return [...new Set(variations)];
}

/**
 * Primary export: ranked playlist search with optional fallback query variations.
 */
exports.searchPlaylists = async (query, limit = 10) => {
  let results = await searchAndRankPlaylists(query, limit);

  if (results.length < limit) {
    const variations = generateSearchVariations(query);
    for (const variant of variations) {
      if (results.length >= limit) break;
      await sleep(300);
      const variantResults = await searchAndRankPlaylists(
        variant,
        Math.min(10, limit - results.length + 2),
      );
      const seen = new Set(results.map((r) => r.id));
      for (const playlist of variantResults) {
        if (!seen.has(playlist.id)) {
          results.push(playlist);
          seen.add(playlist.id);
        }
      }
    }
  }

  return results.slice(0, limit);
};

/**
 * Build a quality-ranked pool from multiple queries.
 * Uses at most 4 queries with a 500ms gap between each.
 */
exports.buildPlaylistPool = async (queries, targetSize = 30) => {
  const pool = [];
  const seen = new Set();

  const MAX_QUERIES = 4;
  const selectedQueries = queries.slice(0, MAX_QUERIES);

  for (const query of selectedQueries) {
    if (pool.length >= targetSize) break;

    const batch = await searchAndRankPlaylists(query, 10);
    for (const playlist of batch) {
      if (!seen.has(playlist.id)) {
        seen.add(playlist.id);
        pool.push(playlist);
      }
    }

    if (pool.length < targetSize) {
      await sleep(500);
    }
  }

  return pool.sort((a, b) => qualityScore(b) - qualityScore(a));
};