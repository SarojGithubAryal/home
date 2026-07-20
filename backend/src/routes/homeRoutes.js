const express = require('express');
const homeController = require('../controllers/HomeController');

const router = express.Router();

// GET /api/home
router.get('/', homeController.getHome);

module.exports = router;