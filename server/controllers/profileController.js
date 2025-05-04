const { Profile } = require('../models');
const { success, error } = require('../utils/response');

/**
 * Update user profile
 * @route PUT /api/profile
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      firstName, 
      lastName, 
      phone, 
      address, 
      resumeUrl, 
      companyName, 
      companyDescription 
    } = req.body;
    
    // Find profile
    let profile = await Profile.findOne({ where: { userId } });
    
    if (!profile) {
      // Create profile if it doesn't exist
      profile = await Profile.create({
        userId,
        firstName,
        lastName,
        phone,
        address,
        resumeUrl,
        companyName,
        companyDescription
      });
      
      return success(res, 201, 'Profile created successfully', { profile });
    }
    
    // Update profile
    await profile.update({
      firstName,
      lastName,
      phone,
      address,
      resumeUrl,
      companyName,
      companyDescription
    });
    
    return success(res, 200, 'Profile updated successfully', { profile });
  } catch (err) {
    console.error('Update profile error:', err);
    return error(res, 500, 'Error updating profile');
  }
};

/**
 * Get user profile
 * @route GET /api/profile
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find profile
    const profile = await Profile.findOne({ where: { userId } });
    
    if (!profile) {
      return error(res, 404, 'Profile not found');
    }
    
    return success(res, 200, 'Profile retrieved successfully', { profile });
  } catch (err) {
    console.error('Get profile error:', err);
    return error(res, 500, 'Error retrieving profile');
  }
};

module.exports = {
  updateProfile,
  getProfile
};
