const express = require('express');
const userController = require('../controllers/UserController');

const router = express.Router();

// GET /api/user/me
router.get('/me', userController.getMe);

// PATCH /api/user/settings
router.patch('/settings', userController.updateSettings);

// Future routes (not yet implemented):
// POST   /api/user/favorites
// DELETE /api/user/favorites/:contentId
// POST   /api/user/bookmarks
// DELETE /api/user/bookmarks/:contentId

module.exports = router;