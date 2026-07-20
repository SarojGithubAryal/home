const express = require('express');
const roomController = require('../controllers/RoomController');

const router = express.Router();

// GET /api/rooms/:roomSlug (read-only, navigation: null)
router.get('/:roomSlug', roomController.getRoom);

// POST /api/rooms/enter (action, returns navigation)
router.post('/enter', roomController.enterRoom);

// Future sub-experience endpoints will be read-only GETs

module.exports = router;