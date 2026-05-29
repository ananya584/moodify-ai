const express = require('express');
const { analyzeMood } = require('../controllers/moodController');

const router = express.Router();

router.post('/analyze', analyzeMood);

module.exports = router;