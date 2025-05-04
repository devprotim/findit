/**
 * Middleware for request validation
 * @param {Function} validationFn - Validation function that returns a validation object
 */
const validate = (validationFn) => {
  return (req, res, next) => {
    const { error } = validationFn(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details
      });
    }

    next();
  };
};

module.exports = validate;
