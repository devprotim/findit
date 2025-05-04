const { sequelize } = require('../config/database');
const { User, Profile, Job, Application } = require('../models');
const bcrypt = require('bcrypt');

/**
 * Initialize database with sample data
 */
const initializeDatabase = async () => {
  try {
    // Sync all models with database
    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    // Create sample users
    const employer = await User.create({
      email: 'employer@example.com',
      password: 'password123',
      role: 'employer'
    });

    const jobSeeker = await User.create({
      email: 'jobseeker@example.com',
      password: 'password123',
      role: 'job_seeker'
    });

    // Create profiles
    await Profile.create({
      userId: employer.id,
      firstName: 'John',
      lastName: 'Doe',
      phone: '555-123-4567',
      companyName: 'Tech Solutions Inc.',
      companyDescription: 'A leading technology company specializing in software development.'
    });

    await Profile.create({
      userId: jobSeeker.id,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '555-987-6543',
      address: '123 Main St, Anytown, USA',
      resumeUrl: 'https://example.com/resume.pdf'
    });

    // Create sample jobs
    const job1 = await Job.create({
      employerId: employer.id,
      title: 'Full Stack Developer',
      description: 'We are looking for a Full Stack Developer to join our team.',
      location: 'New York, NY',
      salaryRange: '$80,000 - $120,000',
      jobType: 'full-time',
      requirements: 'Experience with Node.js, React, and SQL databases.'
    });

    const job2 = await Job.create({
      employerId: employer.id,
      title: 'Frontend Developer',
      description: 'We are seeking a talented Frontend Developer to create amazing user experiences.',
      location: 'Remote',
      salaryRange: '$70,000 - $100,000',
      jobType: 'remote',
      requirements: 'Experience with HTML, CSS, JavaScript, and modern frontend frameworks.'
    });

    // Create sample application
    await Application.create({
      jobId: job1.id,
      applicantId: jobSeeker.id,
      status: 'applied',
      coverLetter: 'I am excited to apply for this position and believe my skills are a great match.'
    });

    console.log('Sample data created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    // Close database connection
    await sequelize.close();
  }
};

// Run the initialization
initializeDatabase();
