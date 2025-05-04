const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate, isEmployer, isJobSeeker } = require('../middleware/auth');
const validate = require('../middleware/validator');
const {
    validateApplicationCreation,
    validateApplicationStatusUpdate
} = require('../services/validationService');

// Apply for a job (job seeker only)
router.post('/', authenticate, isJobSeeker, validate(validateApplicationCreation), applicationController.applyForJob);

// Get applications for a job (employer only)
router.get('/job/:jobId', authenticate, isEmployer, applicationController.getJobApplications);

// Update application status (employer only)
router.put('/:id/status', authenticate, isEmployer, validate(validateApplicationStatusUpdate), applicationController.updateApplicationStatus);

// Get user's applications (job seeker only)
router.get('/me', authenticate, isJobSeeker, applicationController.getUserApplications);

// Get application by ID (both employer and job seeker)
router.get('/:id', authenticate, applicationController.getApplicationById);

module.exports = router;
