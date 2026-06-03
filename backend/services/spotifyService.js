const axios = require('axios');

let spotifyAccessToken = null;
let tokenExpireTime = 0;

const MIN_FOLLOWERS = 100;
const SEARCH_FETCH_LIMIT = 10;

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

function qualityScore(playlist) {
  const followers = playlist.followers || 0;
  const officialBoost = isOfficialCurator(playlist.owner) ? 250_000 : 0;
  const hasImage = playlist.image ? 500 : 0;
  const hasDescription = playlist.description?.length > 20 ? 100 : 0;
  return followers + officialBoost + hasImage + hasDescription;
}

async function fetchPlaylistDetails(playlistId) {
  try {
    const token = await getAccessToken();
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { fields: 'id,name,description,images,owner,followers,external_urls' },
      },
    );

    const data = response.data;
    return {
      id: data.id,
      name: data.name,
      description: stripHtml(data.description) || 'Curated on Spotify',
      image: data.images?.[0]?.url || null,
      owner: data.owner?.display_name || 'Spotify',
      followers: data.followers?.total ?? 0,
      spotifyUrl: data.external_urls?.spotify || `https://open.spotify.com/playlist/${data.id}`,
      spotifyAppUrl: `spotify:playlist:${data.id}`,
    };
  } catch (error) {
    console.error(`Playlist details failed for ${playlistId}:`, error.message);
    return null;
  }
}

async function rawSearchPlaylists(query) {
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
}

/**
 * Search playlists, enrich with follower counts, rank by quality.
 */
async function searchAndRankPlaylists(query, limit = 15) {
  try {
    const items = await rawSearchPlaylists(query);
    if (items.length === 0) return [];

    const detailResults = await Promise.all(
      items.map((p) => fetchPlaylistDetails(p.id)),
    );

    return detailResults
      .filter(Boolean)
      .filter((p) => p.followers >= MIN_FOLLOWERS || isOfficialCurator(p.owner))
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
 * Primary export: ranked playlist search with optional query variations.
 */
exports.searchPlaylists = async (query, limit = 10) => {
  let results = await searchAndRankPlaylists(query, limit);

  if (results.length < limit) {
    const variations = generateSearchVariations(query);
    for (const variant of variations) {
      if (results.length >= limit) break;
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
 * Build a large quality-ranked pool from multiple queries (for rotation).
 */
exports.buildPlaylistPool = async (queries, targetSize = 30) => {
  const pool = [];
  const seen = new Set();

  for (const query of queries) {
    if (pool.length >= targetSize) break;

    const batch = await searchAndRankPlaylists(query, 10);
    for (const playlist of batch) {
      if (!seen.has(playlist.id)) {
        seen.add(playlist.id);
        pool.push(playlist);
      }
    }
  }

  return pool.sort((a, b) => qualityScore(b) - qualityScore(a));
};

exports.getPlaylistDetails = fetchPlaylistDetails;
