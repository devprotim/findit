const app = require('./app');
const config = require('./config/config');
const { sequelize, testConnection } = require('./config/database');

// Start server
const PORT = config.server.port;

const startServer = async () => {
  try {
    // Test database connection
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error('Failed to connect to the database. Exiting...');
      process.exit(1);
    }

    // Sync database models (in development only)
    if (config.server.env === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synced successfully');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running in ${config.server.env} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Start the server
startServer();

