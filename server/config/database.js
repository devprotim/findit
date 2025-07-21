const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database configuration from environment variables
const dbConfig = {
  database: process.env.DB_NAME || 'findit_db',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: process.env.NODE_ENV === 'production' ? 2 : 5, // Reduced for serverless
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: false
  }
};

// For debugging in development
if (process.env.NODE_ENV === 'development') {
  console.log('Database configuration:');
  console.log('DB_NAME:', dbConfig.database);
  console.log('DB_USER:', dbConfig.username);
  console.log('DB_HOST:', dbConfig.host);
  console.log('DB_PORT:', dbConfig.port);
}

// Create a new Sequelize instance with MySQL
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
};
