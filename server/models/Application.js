const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Job = require('./Job');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Job,
      key: 'id',
    },
  },
  applicantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('applied', 'reviewed', 'interviewed', 'rejected', 'hired'),
    allowNull: false,
    defaultValue: 'applied',
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

// Define associations
User.hasMany(Application, { foreignKey: 'applicantId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'applicantId', as: 'applicant' });

Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

module.exports = Application;
