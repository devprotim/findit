const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validator');
const { validateProfileUpdate } = require('../services/validationService');

// Update user profile
router.put('/', authenticate, validate(validateProfileUpdate), profileController.updateProfile);

// Get user profile
router.get('/', authenticate, profileController.getProfile);

module.exports = router;
