const axios = require('axios');

// ==========================
// MOOD -> GENRES MAP
// ==========================

const moodGenreMap = {
  happy: [
    'Happy Hits',
    'Feel Good Friday',
    'Bollywood Party',
    'Punjabi Party',
    'Dance Hits',
    'Mood Booster',
    'Good Vibes',
    'Top Hits India'
  ],

  sad: [
    'Heartbreak Hits',
    'Sad Songs',
    'Bollywood Sad Songs',
    'Broken Heart',
    'Acoustic Chill',
    'Emotional Songs',
    'Alone Again',
    'Late Night Sad'
  ],

  calm: [
    'LoFi Beats',
    'Peaceful Piano',
    'Chill Hits',
    'Relax & Unwind',
    'Evening Acoustic',
    'Deep Focus',
    'Bollywood Chill',
    'Coffee Beats'
  ],

  energetic: [
    'Workout Hits',
    'Gym Motivation',
    'Punjabi Workout',
    'Beast Mode',
    'EDM Hits',
    'Power Workout',
    'Running Music',
    'Dance Energy'
  ],

  romantic: [
    'Love Songs',
    'Romantic Hindi',
    'Bollywood Romance',
    'Date Night',
    'Love Pop',
    'Couple Vibes',
    'Romantic Acoustic',
    'Punjabi Love'
  ],

  focused: [
    'Deep Focus',
    'Coding Mode',
    'Study Beats',
    'Brain Food',
    'Instrumental Focus',
    'LoFi Study',
    'Concentration Music',
    'Productivity Playlist'
  ],

  tired: [
    'Relax & Recharge',
    'Healing Music',
    'Soft Piano',
    'Chill Evening',
    'Calm Acoustic',
    'LoFi Sleep',
    'Slow Vibes',
    'Recovery Mode'
  ],

  bored: [
    'Viral Hits',
    'Trending Now',
    'Top Global Hits',
    'Bollywood Trending',
    'Throwback Hits',
    'Party Mix',
    'Discover Weekly',
    'Fresh Finds'
  ],

  angry: [
    'Rock Classics',
    'Metal Essentials',
    'Rage Beats',
    'Hard Workout',
    'Phonk',
    'Trap Nation',
    'Beast Mode',
    'Aggressive Energy'
  ],

  sleepy: [
    'Sleep',
    'Deep Sleep',
    'Night Rain',
    'Sleep Piano',
    'Meditation Sleep',
    'Calm Ambient',
    'Bedtime Beats',
    'Sleep Sounds'
  ],

  spiritual: [
    'Hanuman Chalisa',
    'Radha Krishna Bhajan',
    'ISKCON Kirtan',
    'Morning Bhakti',
    'Shiv Bhajan',
    'Meditation Mantras',
    'Hare Krishna',
    'Jai Shree Ram',
    'Bhakti Sagar',
    'Devotional Songs'
  ]
};

// ==========================
// MOOD KEYWORDS
// ==========================

const moodKeywords = {
  happy: [
    'happy',
    'joy',
    'excited',
    'cheerful',
    'great',
    'fun',
    'elated',
    'dance',
    'celebrate',
    'party',
    'club',
    'clubbing',
    'club music',
    'club playlist',
    'club music',
    'club mood',
    'club feeling',
    'club emotions',
    'club moments',
    'festive',
    'happy hour',
    'happy vibes',
    'happy songs',
    'happy playlist',
    'happy music',
    'happy mood',
    'happy feeling',
    'happy emotions',
    'happy moments',
    'happy memories',
    'happy thoughts',
    'happy day',
    'happy life'
  ],

  sad: [
    'sad',
    'down',
    'lonely',
    'cry',
    'depressed',
    'upset',
    'miserable',
    'heartbroken',
    'broken heart',
    'heartache',
    'sorrow',
    'grief',
    'loss',
    'despair',
    'sadness',
    'dejection',
    'melancholy',
    'heartbreak',
    'sad songs',
    'emotional',
    'emotional songs',
    'emotional playlist',
    'emotional music',
    'emotional mood',
    'emotional feeling',
    'emotional emotions',
    'emotional moments',
    'emotional memories',
    'emotional thoughts',
    'emotional day',
    'emotional life'
  ],

  calm: [
    'calm',
    'relaxed',
    'peaceful',
    'soft',
    'chill',
    'serene',
    'lofi',
    'tired',
    'relax',
    'relaxing',
    'exhausted'
  ],

  energetic: [
    'energetic',
    'hype',
    'pumped',
    'power',
    'workout',
    'active',
    'gym',
    'boost',
    'dance',
    'exercise',
    'workout',
    'gym',
    'fitness',
    'sports',
    'athletics',
    'dance party',
    'dance workout',
    'dance music',
    'dance playlist',
    'dance music',
  ],

  romantic: [
    'romantic',
    'love',
    'date',
    'heart',
    'affection',
    'crush',
    'romantic songs',
    'romantic playlist',
    'romantic music',
    'romantic mood',
    'romantic feeling',
    'romantic emotions',
    'romantic moments',
    'romantic memories',
    'romantic thoughts',
    'romantic day',
    'romantic life'
  ],

  angry: [
    'angry',
    'mad',
    'frustrated',
    'furious',
    'rage',
    'annoyed'
  ],

  focused: [
    'focus',
    'study',
    'coding',
    'work',
    'productive',
    'concentrate',
    'study music'
  ],

  tired: [
    'tired',
    'exhausted',
    'drained',
    'burnt out',
    'fatigue',
    'low energy'
  ],

  bored: [
    'bored',
    'boring',
    'dull',
    'blank',
    'nothing to do',
    'uninterested'
  ],

  sleepy: [
    'sleepy',
    'sleep',
    'drowsy',
    'sleepy eyes',
    'night'
  ],

  spiritual: [
    'spiritual',
    'bhajan',
    'god',
    'krishna',
    'radha',
    'mahadev',
    'shiv',
    'hanuman',
    'ram',
    'mandir',
    'bhakti',
    'meditation',
    'peace',
    'devotional',
    'hare krishna',
    'jai shree ram',
    'chalisa',
    'kirtan'
  ]
};

// ==========================
// DETECT MOOD
// ==========================

const detectMood = (text) => {
  const normalized = text.toLowerCase();

  let selectedMood = 'calm';
  let maxScore = 0;

  for (const [mood, keywords] of Object.entries(moodKeywords)) {

    const score = keywords.reduce((count, keyword) => {
      return count + (normalized.includes(keyword) ? 1 : 0);
    }, 0);

    if (score > maxScore) {
      selectedMood = mood;
      maxScore = score;
    }
  }

  return selectedMood;
};

// ==========================
// RANDOM GENRES
// ==========================

const getRandomGenres = (mood, count = 4) => {

  const genres = moodGenreMap[mood] || moodGenreMap.calm;

  return [...genres]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};

// ==========================
// SPOTIFY ACCESS TOKEN
// ==========================

const getSpotifyAccessToken = async () => {

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Spotify credentials are missing in environment variables.'
    );
  }

  const authHeader = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString('base64');

  const tokenResponse = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return tokenResponse.data.access_token;
};

// ==========================
// FETCH TRACKS FOR ONE GENRE
// ==========================

const fetchPlaylistsByGenre = async (
  token,
  genre,
  limit = 5
) => {
  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/search',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: genre,
          type: 'playlist',
          market: 'IN',
          limit,
        },
      }
    );

    return response.data.playlists?.items || [];
  } catch (error) {
    console.error(
      `Error fetching playlist ${genre}:`,
      error.response?.data || error.message
    );

    return [];
  }
};

// ==========================
// SHUFFLE ARRAY
// ==========================

const shuffleArray = (array) => {

  return [...array].sort(
    () => Math.random() - 0.5
  );
};

// ==========================
// FETCH RECOMMENDATIONS
// ==========================

const fetchSpotifyRecommendations = async (
  token,
  mood
) => {

  const selectedGenres = getRandomGenres(mood, 4);

  console.log('Selected Genres:', selectedGenres);

  let allPlaylists = [];

  for (const genre of selectedGenres) {

    const playlists =
      await fetchPlaylistsByGenre(
        token,
        genre,
        5
      );

    allPlaylists = [
      ...allPlaylists,
      ...playlists,
    ];
  }

  const validPlaylists = allPlaylists.filter(
    (playlist) =>
      playlist &&
      playlist.id &&
      playlist.name
  );
  
  const uniquePlaylists = Array.from(
    new Map(
      validPlaylists.map((playlist) => [
        playlist.id,
        playlist,
      ])
    ).values()
  );

  const shuffled =
    shuffleArray(uniquePlaylists);

  return shuffled
    .slice(0, 12)
    .map((playlist) => ({
      id: playlist.id,

      name: playlist.name,

      description:
        playlist.description ||
        'Spotify Playlist',

      image:
        playlist.images?.[0]?.url ||
        null,

      spotifyUrl:
        playlist.external_urls?.spotify ||
        null,

      owner:
        playlist.owner?.display_name ||
        'Spotify',
    }));
};

// ==========================
// MAIN CONTROLLER
// ==========================

const analyzeMood = async (req, res) => {

  try {

    const { mood } = req.body;

    // Validation
    if (
      !mood ||
      typeof mood !== 'string' ||
      !mood.trim()
    ) {

      return res.status(400).json({
        message: 'Mood text is required',
      });
    }

    // Clean input
    const normalizedMoodText = mood.trim();

    // Detect mood
    const detectedMood = detectMood(
      normalizedMoodText
    );

    console.log(
      'Detected Mood:',
      detectedMood
    );

    // Spotify token
    const token =
      await getSpotifyAccessToken();

    // Recommendations
    const recommendations =
      await fetchSpotifyRecommendations(
        token,
        detectedMood
      );

    // Response
    return res.status(200).json({

      message:
        'Mood analyzed successfully',

      input: normalizedMoodText,

      detectedMood,

      totalRecommendations:
        recommendations.length,

      recommendations,
    });

  } catch (error) {

    console.error(
      'analyzeMood error:',
      error.response?.data || error.message
    );

    return res.status(500).json({
      message:
        'Unable to fetch music recommendations right now.',
    });
  }
};

// ==========================
// EXPORTS
// ==========================

module.exports = {
  analyzeMood,
};