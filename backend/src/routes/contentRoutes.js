const express = require('express');
const contentController = require('../controllers/ContentController');

const router = express.Router();

// GET /api/contents/:contentId
router.get('/:contentId', contentController.getContent);

module.exports = router;