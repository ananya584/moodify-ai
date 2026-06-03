const express = require('express');
const moodController = require('../controllers/moodController');

const router = express.Router();

// POST /api/mood/analyze
// Body: { mood: string, preference: string }
// Response: { detectedMood, subMood, insight, genres, recommendations }
router.post('/analyze', moodController.analyzeMood);

module.exports = router;