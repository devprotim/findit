const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticate, isEmployer } = require('../middleware/auth');
const validate = require('../middleware/validator');
const { validateJobCreation } = require('../services/validationService');

// Get jobs posted by the current employer (employer only)
// Note: This route must be defined before the /:id route to avoid conflicts
router.get('/employer/me', authenticate, isEmployer, jobController.getEmployerJobs);

// Get all jobs (public)
router.get('/', jobController.getJobs);

// Get job by ID (public)
router.get('/:id', jobController.getJobById);

// Create a new job (employer only)
router.post('/', authenticate, isEmployer, validate(validateJobCreation), jobController.createJob);

// Update job (employer only)
router.put('/:id', authenticate, isEmployer, validate(validateJobCreation), jobController.updateJob);

// Delete job (employer only)
router.delete('/:id', authenticate, isEmployer, jobController.deleteJob);

module.exports = router;
