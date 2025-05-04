const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salaryRange: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jobType: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'remote'),
    allowNull: false,
    defaultValue: 'full-time',
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'closed'),
    allowNull: false,
    defaultValue: 'active',
  },
}, {
  timestamps: true,
});

// Define associations
User.hasMany(Job, { foreignKey: 'employerId', as: 'jobs' });
Job.belongsTo(User, { foreignKey: 'employerId', as: 'employer' });

module.exports = Job;
