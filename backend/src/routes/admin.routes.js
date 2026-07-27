const express = require('express');
const adminController = require('../controllers/admin.controller');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// All admin routes require authentication
router.use(adminAuth);

// Dashboard
router.get('/dashboard', adminController.dashboard);

// Content management
router.get('/content', adminController.listContent);
router.get('/content/:id', adminController.getContent);
router.post('/content', adminController.createContent);
router.patch('/content/:id', adminController.updateContent);
router.delete('/content/:id', adminController.deleteContent);

// Experience management
router.get('/experience', adminController.getExperience);
router.patch('/experience', adminController.updateExperience);

// Settings
router.get('/settings', adminController.getSettings);
router.patch('/settings', adminController.updateSettings);

module.exports = router;