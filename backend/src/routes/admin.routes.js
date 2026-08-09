const express = require('express');
const adminController = require('../controllers/admin.controller');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload.middleware');   // multer middleware

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

// Media upload / edit / delete (multer middleware applied only to file routes)
router.post('/media', upload.single('file'), adminController.uploadMedia);
router.patch('/media/:id', upload.single('file'), adminController.updateMedia);
router.delete('/media/:id', adminController.deleteMedia);

module.exports = router;