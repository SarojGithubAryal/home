const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');

router.get('/', moodController.getAllMoods);
router.get('/:id', moodController.getMoodById);

module.exports = router;