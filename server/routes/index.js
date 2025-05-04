const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const jobRoutes = require('./jobRoutes');
const applicationRoutes = require('./applicationRoutes');
const profileRoutes = require('./profileRoutes');

// API routes
router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/profile', profileRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

module.exports = router;
