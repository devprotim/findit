/**
 * Validation schemas for API requests
 */

/**
 * Validate user registration request
 * @param {Object} data - Request body
 * @returns {Object} Validation result
 */
const validateRegistration = (data) => {
  const errors = [];
  
  // Email validation
  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }
  
  // Password validation
  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (data.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }
  
  // Role validation
  if (!data.role) {
    errors.push({ field: 'role', message: 'Role is required' });
  } else if (!['job_seeker', 'employer'].includes(data.role)) {
    errors.push({ field: 'role', message: 'Role must be either job_seeker or employer' });
  }
  
  return {
    error: errors.length > 0 ? { details: errors } : null
  };
};

/**
 * Validate login request
 * @param {Object} data - Request body
 * @returns {Object} Validation result
 */
const validateLogin = (data) => {
  const errors = [];
  
  // Email validation
  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  }
  
  // Password validation
  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }
  
  return {
    error: errors.length > 0 ? { details: errors } : null
  };
};

/**
 * Validate job creation request
 * @param {Object} data - Request body
 * @returns {Object} Validation result
 */
const validateJobCreation = (data) => {
  const errors = [];
  
  // Title validation
  if (!data.title) {
    errors.push({ field: 'title', message: 'Title is required' });
  }
  
  // Description validation
  if (!data.description) {
    errors.push({ field: 'description', message: 'Description is required' });
  }
  
  // Location validation
  if (!data.location) {
    errors.push({ field: 'location', message: 'Location is required' });
  }
  
  // Job type validation
  if (data.jobType && !['full-time', 'part-time', 'contract', 'internship', 'remote'].includes(data.jobType)) {
    errors.push({ field: 'jobType', message: 'Invalid job type' });
  }
  
  return {
    error: errors.length > 0 ? { details: errors } : null
  };
};

/**
 * Validate application creation request
 * @param {Object} data - Request body
 * @returns {Object} Validation result
 */
const validateApplicationCreation = (data) => {
  const errors = [];
  
  // Job ID validation
  if (!data.jobId) {
    errors.push({ field: 'jobId', message: 'Job ID is required' });
  }
  
  return {
    error: errors.length > 0 ? { details: errors } : null
  };
};

/**
 * Validate application status update request
 * @param {Object} data - Request body
 * @returns {Object} Validation result
 */
const validateApplicationStatusUpdate = (data) => {
  const errors = [];
  
  // Status validation
  if (!data.status) {
    errors.push({ field: 'status', message: 'Status is required' });
  } else if (!['applied', 'reviewed', 'interviewed', 'rejected', 'hired'].includes(data.status)) {
    errors.push({ field: 'status', message: 'Invalid status' });
  }
  
  return {
    error: errors.length > 0 ? { details: errors } : null
  };
};

/**
 * Validate profile update request
 * @param {Object} data - Request body
 * @returns {Object} Validation result
 */
const validateProfileUpdate = (data) => {
  // No strict validation for profile update
  // All fields are optional
  return { error: null };
};

/**
 * Helper function to validate email format
 * @param {String} email - Email to validate
 * @returns {Boolean} Is valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateJobCreation,
  validateApplicationCreation,
  validateApplicationStatusUpdate,
  validateProfileUpdate
};
