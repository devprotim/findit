const { User, Profile } = require('../models');
const { generateToken } = require('../utils/jwt');
const { success, error } = require('../utils/response');
const { sequelize } = require('../config/database');

/**
 * Register a new user
 * @route POST /api/auth/register
 */
const register = async (req, res) => {
  const { email, password, role, firstName, lastName } = req.body;

  const transaction = await sequelize.transaction();

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      await transaction.rollback();
      return error(res, 400, 'User with this email already exists');
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role
    }, { transaction });

    // Create profile
    await Profile.create({
      userId: user.id,
      firstName,
      lastName
    }, { transaction });

    await transaction.commit();

    // Generate token
    const token = generateToken(user);

    return success(res, 201, 'User registered successfully', {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    await transaction.rollback();
    console.error('Registration error:', err);
    return error(res, 500, 'Error registering user');
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return error(res, 401, 'Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.isValidPassword(password);

    if (!isPasswordValid) {
      return error(res, 401, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken(user);

    return success(res, 200, 'Login successful', {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    return error(res, 500, 'Error logging in');
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Profile, as: 'profile' }],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return error(res, 404, 'User not found');
    }

    return success(res, 200, 'User profile retrieved successfully', { user });
  } catch (err) {
    console.error('Get current user error:', err);
    return error(res, 500, 'Error retrieving user profile');
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};
