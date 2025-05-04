const User = require('./User');
const Profile = require('./Profile');
const Job = require('./Job');
const Application = require('./Application');

// All associations are defined in the individual model files
// This file is used to export all models from a single point

module.exports = {
  User,
  Profile,
  Job,
  Application
};
