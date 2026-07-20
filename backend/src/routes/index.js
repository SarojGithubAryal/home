const express = require('express');
const homeRoutes = require('./homeRoutes');
const roomRoutes = require('./roomRoutes');
const moodRoutes = require('./moodRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/home', homeRoutes);
router.use('/rooms', roomRoutes);
router.use('/moods', moodRoutes);
router.use('/user', userRoutes);

module.exports = router;