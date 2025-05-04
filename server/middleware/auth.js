const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Find user by id
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

/**
 * Middleware to check if user is an employer
 */
const isEmployer = (req, res, next) => {
  if (req.user && req.user.role === 'employer') {
    return next();
  }
  
  return res.status(403).json({ 
    success: false, 
    message: 'Access denied. Employer role required.' 
  });
};

/**
 * Middleware to check if user is a job seeker
 */
const isJobSeeker = (req, res, next) => {
  if (req.user && req.user.role === 'job_seeker') {
    return next();
  }
  
  return res.status(403).json({ 
    success: false, 
    message: 'Access denied. Job seeker role required.' 
  });
};

module.exports = {
  authenticate,
  isEmployer,
  isJobSeeker
};
