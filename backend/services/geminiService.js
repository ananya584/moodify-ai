const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const VALID_MOODS = [
  'happy',
  'sad',
  'calm',
  'energetic',
  'focused',
  'romantic',
  'angry',
  'anxious',
  'sleepy',
  'nostalgic',
  'hopeful',
];

exports.analyzeMood = async (moodText) => {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You analyze mood descriptions in English, Hindi, or Hinglish for a music app.

Return JSON only:
{
  "detectedMood": "primary mood (one word, lowercase English: happy|sad|calm|energetic|focused|romantic|angry|anxious|sleepy|nostalgic|hopeful)",
  "subMood": "secondary need or feeling in plain English, or empty string",
  "insight": "1-2 sentences: what music will help right now (comforting, uplifting, etc.)",
  "musicVibe": "short phrase for playlist search e.g. sad comforting sleep",
  "genres": ["2-4 genre tags useful for search"]
}

Rules:
- Understand mixed statements: primary emotion + what they need now.
- Example: "raat ko breakup hua hai ab neend chahiye" → detectedMood: "sad", subMood: "sleep", insight about sad comforting music for rest, musicVibe: "sad comforting sleep".
- Example: "bahut khush hoon party mood" → detectedMood: "happy", subMood: "party", musicVibe: "happy party upbeat".
- subMood captures sleep, comfort, motivation, focus, nostalgia, etc. when present.
- insight should be warm and specific, not generic.`,
        },
        {
          role: 'user',
          content: moodText,
        },
      ],
    });

    const cleaned = completion.choices[0].message.content
      .trim()
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);
    const detectedMood = (parsed.detectedMood || 'calm').toLowerCase();

    return {
      detectedMood: VALID_MOODS.includes(detectedMood) ? detectedMood : 'calm',
      subMood: (parsed.subMood || '').toLowerCase().trim(),
      insight: parsed.insight || '',
      musicVibe: parsed.musicVibe || '',
      genres: Array.isArray(parsed.genres) ? parsed.genres.map((g) => String(g).toLowerCase()) : [],
    };
  } catch (error) {
    console.error('Error analyzing mood with Groq:', error);
    return getBasicMoodAnalysis(moodText);
  }
};

function getBasicMoodAnalysis(text) {
  const lower = text.toLowerCase();

  const moodKeywords = {
    happy: ['happy', 'excited', 'joyful', 'khush', 'maza', 'great', 'awesome'],
    sad: ['sad', 'unhappy', 'down', 'depressed', 'breakup', 'hurt', 'dukhi', 'rona', 'akela'],
    calm: ['calm', 'peaceful', 'relaxed', 'chill', 'shant', 'sukoon'],
    energetic: ['energetic', 'hyper', 'pumped', 'party', 'dance', 'taaqat'],
    focused: ['focused', 'study', 'work', 'productive', 'padhna', 'exam'],
    romantic: ['love', 'romantic', 'crush', 'pyaar', 'ishq'],
    angry: ['angry', 'gussa', 'frustrated', 'rage'],
    anxious: ['anxious', 'worried', 'stressed', 'tension', 'ghabra'],
    sleepy: ['sleep', 'neend', 'tired', 'exhausted', 'soona', 'rest', 'insomnia'],
  };

  let detectedMood = 'calm';
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      detectedMood = mood;
      break;
    }
  }

  const subMoodMap = {
    sleep: ['sleep', 'neend', 'soona', 'rest', 'bed', 'raat'],
    comfort: ['comfort', 'sahara', 'support', 'hug', 'dukhi'],
    party: ['party', 'club', 'dance'],
    focus: ['focus', 'study', 'work', 'padhna'],
    motivation: ['motivation', 'gym', 'workout', 'hustle'],
  };

  let subMood = '';
  for (const [sub, keywords] of Object.entries(subMoodMap)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      subMood = sub;
      break;
    }
  }

  const moodGenreMap = {
    happy: ['pop', 'upbeat', 'dance'],
    sad: ['indie', 'emotional', 'acoustic'],
    calm: ['ambient', 'chill', 'acoustic'],
    energetic: ['electronic', 'dance', 'hip-hop'],
    focused: ['lo-fi', 'instrumental', 'ambient'],
    romantic: ['r&b', 'soul', 'indie'],
    angry: ['rock', 'metal', 'intense'],
    anxious: ['ambient', 'meditative', 'piano'],
    sleepy: ['ambient', 'sleep', 'piano'],
  };

  const vibeParts = [detectedMood];
  if (subMood) vibeParts.push(subMood);
  if (detectedMood === 'sad' && subMood === 'sleep') vibeParts.push('comforting');

  return {
    detectedMood,
    subMood,
    insight: subMood
      ? `Sounds like you're feeling ${detectedMood} and need ${subMood} — we'll find ${detectedMood}, soothing tracks for that.`
      : `You're in a ${detectedMood} space — let's match playlists to that energy.`,
    musicVibe: vibeParts.join(' '),
    genres: moodGenreMap[detectedMood] || ['chill', 'ambient'],
  };
}
