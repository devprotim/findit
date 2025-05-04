const { Job, User, Profile } = require('../models');
const { success, error } = require('../utils/response');
const { Op } = require('sequelize');

/**
 * Create a new job
 * @route POST /api/jobs
 */
const createJob = async (req, res) => {
  try {
    const { title, description, location, salaryRange, jobType, requirements } = req.body;
    
    // Create job
    const job = await Job.create({
      employerId: req.user.id,
      title,
      description,
      location,
      salaryRange,
      jobType,
      requirements
    });
    
    return success(res, 201, 'Job created successfully', { job });
  } catch (err) {
    console.error('Create job error:', err);
    return error(res, 500, 'Error creating job');
  }
};

/**
 * Get all jobs with filtering
 * @route GET /api/jobs
 */
const getJobs = async (req, res) => {
  try {
    const { 
      title, 
      location, 
      jobType, 
      status = 'active',
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Build filter conditions
    const whereConditions = { status };
    
    if (title) {
      whereConditions.title = { [Op.like]: `%${title}%` };
    }
    
    if (location) {
      whereConditions.location = { [Op.like]: `%${location}%` };
    }
    
    if (jobType) {
      whereConditions.jobType = jobType;
    }
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Get jobs
    const { count, rows: jobs } = await Job.findAndCountAll({
      where: whereConditions,
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
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    
    return success(res, 200, 'Jobs retrieved successfully', {
      jobs,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Get jobs error:', err);
    return error(res, 500, 'Error retrieving jobs');
  }
};

/**
 * Get job by ID
 * @route GET /api/jobs/:id
 */
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findByPk(id, {
      include: [
        {
          model: User,
          as: 'employer',
          attributes: ['id', 'email'],
          include: [
            {
              model: Profile,
              as: 'profile',
              attributes: ['companyName', 'companyDescription']
            }
          ]
        }
      ]
    });
    
    if (!job) {
      return error(res, 404, 'Job not found');
    }
    
    return success(res, 200, 'Job retrieved successfully', { job });
  } catch (err) {
    console.error('Get job by ID error:', err);
    return error(res, 500, 'Error retrieving job');
  }
};

/**
 * Update job
 * @route PUT /api/jobs/:id
 */
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, salaryRange, jobType, requirements, status } = req.body;
    
    // Find job
    const job = await Job.findByPk(id);
    
    if (!job) {
      return error(res, 404, 'Job not found');
    }
    
    // Check if user is the employer
    if (job.employerId !== req.user.id) {
      return error(res, 403, 'Not authorized to update this job');
    }
    
    // Update job
    await job.update({
      title,
      description,
      location,
      salaryRange,
      jobType,
      requirements,
      status
    });
    
    return success(res, 200, 'Job updated successfully', { job });
  } catch (err) {
    console.error('Update job error:', err);
    return error(res, 500, 'Error updating job');
  }
};

/**
 * Delete job
 * @route DELETE /api/jobs/:id
 */
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find job
    const job = await Job.findByPk(id);
    
    if (!job) {
      return error(res, 404, 'Job not found');
    }
    
    // Check if user is the employer
    if (job.employerId !== req.user.id) {
      return error(res, 403, 'Not authorized to delete this job');
    }
    
    // Delete job
    await job.destroy();
    
    return success(res, 200, 'Job deleted successfully');
  } catch (err) {
    console.error('Delete job error:', err);
    return error(res, 500, 'Error deleting job');
  }
};

/**
 * Get jobs posted by the current employer
 * @route GET /api/jobs/employer/me
 */
const getEmployerJobs = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build filter conditions
    const whereConditions = { employerId: req.user.id };
    
    if (status) {
      whereConditions.status = status;
    }
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Get jobs
    const { count, rows: jobs } = await Job.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    
    return success(res, 200, 'Employer jobs retrieved successfully', {
      jobs,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Get employer jobs error:', err);
    return error(res, 500, 'Error retrieving employer jobs');
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getEmployerJobs
};
