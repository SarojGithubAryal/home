const express = require('express');
const moodController = require('../controllers/MoodController');

const router = express.Router();

// GET /api/moods
router.get('/', moodController.getMoods);

// POST /api/moods/select (action that returns navigation)
router.post('/select', moodController.selectMood);

// GET /api/moods/:moodSlug (Mood resource – returns the full Mood Landing experience)
router.get('/:moodSlug', moodController.getMood);

// GET /api/moods/:moodSlug/landing
router.get('/:moodSlug/landing', moodController.getMoodLanding);

module.exports = router;