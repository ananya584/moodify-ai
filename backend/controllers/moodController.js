const geminiService = require('../services/geminiService');
const spotifyService = require('../services/spotifyService');

/** @type {Map<string, { pool: object[], offset: number }>} */
const rotationStore = new Map();

function rotationKey(mood, preference, detectedMood, subMood) {
  return [
    mood.trim().toLowerCase(),
    preference.trim().toLowerCase(),
    detectedMood,
    subMood || '',
  ].join('|');
}

function generateSearchQueries(mood, subMood, preference, genres = [], musicVibe = '') {
  const queries = [];
  const pref = preference.trim();

  if (musicVibe) {
    queries.push(`${musicVibe} ${pref}`);
    queries.push(`${musicVibe} playlist`);
  }

  queries.push(`${mood} ${pref} playlist`);
  queries.push(`${pref} ${mood}`);

  if (subMood) {
    queries.push(`${mood} ${subMood} ${pref}`);
    queries.push(`${subMood} ${pref} music`);
    queries.push(`comforting ${subMood} ${pref}`);
  }

  const moodDescriptors = {
    sad: ['heartbreak', 'emotional', 'melancholy'],
    happy: ['feel good', 'upbeat', 'party'],
    calm: ['chill', 'relaxing', 'peaceful'],
    energetic: ['workout', 'hype', 'dance'],
    focused: ['study', 'concentration', 'lo-fi'],
    romantic: ['love songs', 'romance'],
    angry: ['intense', 'rage'],
    anxious: ['soothing', 'calm'],
    sleepy: ['sleep', 'bedtime', 'night'],
  };

  const descriptors = moodDescriptors[mood.toLowerCase()] || ['mood'];
  for (const descriptor of descriptors.slice(0, 2)) {
    queries.push(`${pref} ${descriptor}`);
  }

  for (const genre of genres.slice(0, 2)) {
    queries.push(`${pref} ${genre} playlist`);
  }

  queries.push(`${mood} ${pref} hits`);
  queries.push(`best ${pref} ${mood}`);

  return [...new Set(queries)];
}

function takeNextBatch(state, batchSize = 5) {
  const { pool, offset } = state;
  if (offset >= pool.length) {
    return { batch: [], newOffset: offset, exhausted: true };
  }

  const batch = pool.slice(offset, offset + batchSize);
  return {
    batch,
    newOffset: offset + batch.length,
    exhausted: offset + batchSize >= pool.length,
  };
}

exports.analyzeMood = async (req, res) => {
  try {
    const { mood, preference } = req.body;

    if (!mood?.trim() || !preference?.trim()) {
      return res.status(400).json({
        message: 'Both mood and music preference are required.',
      });
    }

    const trimmedMood = mood.trim();
    const trimmedPreference = preference.trim();

    const moodAnalysis = await geminiService.analyzeMood(trimmedMood);

    if (!moodAnalysis?.detectedMood) {
      return res.status(500).json({ message: 'Failed to analyze mood. Please try again.' });
    }

    const { detectedMood, subMood, insight, genres, musicVibe } = moodAnalysis;

    const key = rotationKey(trimmedMood, trimmedPreference, detectedMood, subMood);
    let state = rotationStore.get(key);

    const needsFreshPool =
      !state ||
      state.pool.length < 5 ||
      state.offset >= state.pool.length;

    if (needsFreshPool) {
      const searchQueries = generateSearchQueries(
        detectedMood,
        subMood,
        trimmedPreference,
        genres,
        musicVibe,
      );

      const newPool = await spotifyService.buildPlaylistPool(searchQueries, 35);

      if (state?.pool?.length) {
        const seen = new Set(state.pool.map((p) => p.id));
        const merged = [...state.pool];
        for (const playlist of newPool) {
          if (!seen.has(playlist.id)) {
            merged.push(playlist);
            seen.add(playlist.id);
          }
        }
        state = { pool: merged, offset: state.offset };
      } else {
        state = { pool: newPool, offset: 0 };
      }

      if (state.pool.length === 0) {
        const fallback = await spotifyService.searchPlaylists(
          `${detectedMood} ${trimmedPreference} playlist`,
          10,
        );
        state.pool = fallback;
        state.offset = 0;
      }
    }

    const { batch, newOffset } = takeNextBatch(state, 5);
    state.offset = newOffset;
    rotationStore.set(key, state);

    let recommendations = batch;

    if (recommendations.length < 5) {
      const extra = await spotifyService.searchPlaylists(
        `${detectedMood} ${trimmedPreference}`,
        8,
      );
      const seen = new Set(recommendations.map((p) => p.id));
      for (const playlist of extra) {
        if (!seen.has(playlist.id) && recommendations.length < 5) {
          recommendations.push(playlist);
          seen.add(playlist.id);
        }
      }
    }

    res.json({
      detectedMood,
      subMood: subMood || null,
      insight,
      musicVibe: musicVibe || null,
      genres,
      preference: trimmedPreference,
      recommendations: recommendations.slice(0, 5),
      hasMore: state.offset < state.pool.length,
    });
  } catch (error) {
    console.error('Error analyzing mood:', error);
    res.status(500).json({
      message: error.message || 'Failed to analyze mood',
    });
  }
};

function cleanupRotationStore() {
  if (rotationStore.size > 80) {
    const keys = Array.from(rotationStore.keys());
    keys.slice(0, keys.length - 40).forEach((k) => rotationStore.delete(k));
  }
}

setInterval(cleanupRotationStore, 10 * 60 * 1000);
