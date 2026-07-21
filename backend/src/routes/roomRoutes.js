const express = require('express');
const roomController = require('../controllers/RoomController');
const roomExperienceController = require('../controllers/RoomExperienceController');

const router = express.Router();

// Existing room page routes
router.get('/:roomSlug', roomController.getRoom);
router.post('/enter', roomController.enterRoom);

// New sub‑experience endpoints (hear, read, see, memory)
router.get('/:roomSlug/hear',   (req, res, next) => {
  req.params.experienceType = 'hear';
  roomExperienceController.getExperience(req, res, next);
});
router.get('/:roomSlug/read',   (req, res, next) => {
  req.params.experienceType = 'read';
  roomExperienceController.getExperience(req, res, next);
});
router.get('/:roomSlug/see',    (req, res, next) => {
  req.params.experienceType = 'see';
  roomExperienceController.getExperience(req, res, next);
});
router.get('/:roomSlug/memory', (req, res, next) => {
  req.params.experienceType = 'memory';
  roomExperienceController.getExperience(req, res, next);
});

module.exports = router;