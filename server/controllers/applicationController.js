const { Application, Job, User, Profile } = require('../models');
const { success, error } = require('../utils/response');
const { sequelize } = require('../config/database');

/**
 * Apply for a job
 * @route POST /api/applications
 */
const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    
    // Check if job exists
    const job = await Job.findByPk(jobId);
    
    if (!job) {
      return error(res, 404, 'Job not found');
    }
    
    // Check if job is active
    if (job.status !== 'active') {
      return error(res, 400, 'This job is no longer accepting applications');
    }
    
    // Check if user has already applied
    const existingApplication = await Application.findOne({
      where: {
        jobId,
        applicantId: req.user.id
      }
    });
    
    if (existingApplication) {
      return error(res, 400, 'You have already applied for this job');
    }
    
    // Create application
    const application = await Application.create({
      jobId,
      applicantId: req.user.id,
      coverLetter
    });
    
    return success(res, 201, 'Application submitted successfully', { application });
  } catch (err) {
    console.error('Apply for job error:', err);
    return error(res, 500, 'Error submitting application');
  }
};

/**
 * Get applications for a job (employer only)
 * @route GET /api/applications/job/:jobId
 */
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    
    // Check if job exists
    const job = await Job.findByPk(jobId);
    
    if (!job) {
      return error(res, 404, 'Job not found');
    }
    
    // Check if user is the employer
    if (job.employerId !== req.user.id) {
      return error(res, 403, 'Not authorized to view these applications');
    }
    
    // Build filter conditions
    const whereConditions = { jobId };
    
    if (status) {
      whereConditions.status = status;
    }
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Get applications
    const { count, rows: applications } = await Application.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'email'],
          include: [
            {
              model: Profile,
              as: 'profile',
              attributes: ['firstName', 'lastName', 'resumeUrl']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    
    return success(res, 200, 'Job applications retrieved successfully', {
      applications,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Get job applications error:', err);
    return error(res, 500, 'Error retrieving job applications');
  }
};

/**
 * Update application status (employer only)
 * @route PUT /api/applications/:id/status
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Find application
    const application = await Application.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job'
        }
      ]
    });
    
    if (!application) {
      return error(res, 404, 'Application not found');
    }
    
    // Check if user is the employer
    if (application.job.employerId !== req.user.id) {
      return error(res, 403, 'Not authorized to update this application');
    }
    
    // Update application status
    await application.update({ status });
    
    return success(res, 200, 'Application status updated successfully', { application });
  } catch (err) {
    console.error('Update application status error:', err);
    return error(res, 500, 'Error updating application status');
  }
};

/**
 * Get user's applications (job seeker only)
 * @route GET /api/applications/me
 */
const getUserApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build filter conditions
    const whereConditions = { applicantId: req.user.id };
    
    if (status) {
      whereConditions.status = status;
    }
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Get applications
    const { count, rows: applications } = await Application.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'employer',
              attributes: ['id', 'email'],
              include: [
                {
                  model: Profile,
                  as: 'profile',
                  attributes: ['companyName']
                }
              ]
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    
    return success(res, 200, 'User applications retrieved successfully', {
      applications,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Get user applications error:', err);
    return error(res, 500, 'Error retrieving user applications');
  }
};

/**
 * Get application by ID
 * @route GET /api/applications/:id
 */
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find application
    const application = await Application.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'employer',
              attributes: ['id', 'email'],
              include: [
                {
                  model: Profile,
                  as: 'profile',
                  attributes: ['companyName']
                }
              ]
            }
          ]
        },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'email'],
          include: [
            {
              model: Profile,
              as: 'profile',
              attributes: ['firstName', 'lastName', 'resumeUrl']
            }
          ]
        }
      ]
    });
    
    if (!application) {
      return error(res, 404, 'Application not found');
    }
    
    // Check if user is authorized to view this application
    if (
      application.applicantId !== req.user.id && 
      application.job.employerId !== req.user.id
    ) {
      return error(res, 403, 'Not authorized to view this application');
    }
    
    return success(res, 200, 'Application retrieved successfully', { application });
  } catch (err) {
    console.error('Get application by ID error:', err);
    return error(res, 500, 'Error retrieving application');
  }
};

module.exports = {
  applyForJob,
  getJobApplications,
  updateApplicationStatus,
  getUserApplications,
  getApplicationById
};
