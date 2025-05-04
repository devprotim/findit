const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validator');
const {
    validateRegistration,
    validateLogin
} = require('../services/validationService');

// Register a new user
router.post('/register', validate(validateRegistration), authController.register);

// Login user
router.post('/login', validate(validateLogin), authController.login);

// Get current user profile
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
