const axios = require('axios');
require('dotenv').config();

const API_URL = `http://localhost:${process.env.PORT || 3000}/api`;
let authToken = '';

/**
 * Test API endpoints
 */
const testApi = async () => {
  try {
    console.log('Testing API endpoints...\n');

    // 1. Health check
    console.log('1. Testing health check endpoint...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('Health check response:', healthResponse.data);
    console.log('Health check test passed!\n');

    // 2. Register a new employer
    console.log('2. Testing user registration (employer)...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      email: 'test-employer@example.com',
      password: 'password123',
      role: 'employer',
      firstName: 'Test',
      lastName: 'Employer'
    });
    console.log('Registration response:', registerResponse.data);
    authToken = registerResponse.data.data.token;
    console.log('Registration test passed!\n');

    // 3. Login
    console.log('3. Testing user login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'test-employer@example.com',
      password: 'password123'
    });
    console.log('Login response:', loginResponse.data);
    authToken = loginResponse.data.data.token;
    console.log('Login test passed!\n');

    // 4. Get current user
    console.log('4. Testing get current user...');
    const userResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('Current user response:', userResponse.data);
    console.log('Get current user test passed!\n');

    // 5. Update profile
    console.log('5. Testing update profile...');
    const profileResponse = await axios.put(
      `${API_URL}/profile`,
      {
        firstName: 'Updated',
        lastName: 'Employer',
        companyName: 'Test Company',
        companyDescription: 'A test company'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('Update profile response:', profileResponse.data);
    console.log('Update profile test passed!\n');

    // 6. Create a job
    console.log('6. Testing create job...');
    const jobResponse = await axios.post(
      `${API_URL}/jobs`,
      {
        title: 'Test Job',
        description: 'This is a test job posting',
        location: 'Remote',
        salaryRange: '$50,000 - $70,000',
        jobType: 'full-time',
        requirements: 'Test requirements'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('Create job response:', jobResponse.data);
    const jobId = jobResponse.data.data.job.id;
    console.log('Create job test passed!\n');

    // 7. Get all jobs
    console.log('7. Testing get all jobs...');
    const jobsResponse = await axios.get(`${API_URL}/jobs`);
    console.log('Get jobs response:', jobsResponse.data);
    console.log('Get all jobs test passed!\n');

    // 8. Get job by ID
    console.log('8. Testing get job by ID...');
    const jobByIdResponse = await axios.get(`${API_URL}/jobs/${jobId}`);
    console.log('Get job by ID response:', jobByIdResponse.data);
    console.log('Get job by ID test passed!\n');

    // 9. Update job
    console.log('9. Testing update job...');
    const updateJobResponse = await axios.put(
      `${API_URL}/jobs/${jobId}`,
      {
        title: 'Updated Test Job',
        description: 'This is an updated test job posting',
        location: 'Remote',
        salaryRange: '$60,000 - $80,000',
        jobType: 'full-time',
        requirements: 'Updated test requirements'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('Update job response:', updateJobResponse.data);
    console.log('Update job test passed!\n');

    // 10. Register a job seeker
    console.log('10. Testing user registration (job seeker)...');
    const registerJobSeekerResponse = await axios.post(`${API_URL}/auth/register`, {
      email: 'test-jobseeker@example.com',
      password: 'password123',
      role: 'job_seeker',
      firstName: 'Test',
      lastName: 'JobSeeker'
    });
    console.log('Job seeker registration response:', registerJobSeekerResponse.data);
    const jobSeekerToken = registerJobSeekerResponse.data.data.token;
    console.log('Job seeker registration test passed!\n');

    // 11. Apply for a job
    console.log('11. Testing apply for job...');
    const applyResponse = await axios.post(
      `${API_URL}/applications`,
      {
        jobId,
        coverLetter: 'This is a test application'
      },
      {
        headers: { Authorization: `Bearer ${jobSeekerToken}` }
      }
    );
    console.log('Apply for job response:', applyResponse.data);
    const applicationId = applyResponse.data.data.application.id;
    console.log('Apply for job test passed!\n');

    // 12. Get job seeker applications
    console.log('12. Testing get job seeker applications...');
    const jobSeekerApplicationsResponse = await axios.get(`${API_URL}/applications/me`, {
      headers: { Authorization: `Bearer ${jobSeekerToken}` }
    });
    console.log('Job seeker applications response:', jobSeekerApplicationsResponse.data);
    console.log('Get job seeker applications test passed!\n');

    // 13. Get job applications (employer)
    console.log('13. Testing get job applications (employer)...');
    const jobApplicationsResponse = await axios.get(`${API_URL}/applications/job/${jobId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('Job applications response:', jobApplicationsResponse.data);
    console.log('Get job applications test passed!\n');

    // 14. Update application status
    console.log('14. Testing update application status...');
    const updateApplicationResponse = await axios.put(
      `${API_URL}/applications/${applicationId}/status`,
      {
        status: 'reviewed'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('Update application status response:', updateApplicationResponse.data);
    console.log('Update application status test passed!\n');

    // 15. Get application by ID
    console.log('15. Testing get application by ID...');
    const applicationByIdResponse = await axios.get(`${API_URL}/applications/${applicationId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('Get application by ID response:', applicationByIdResponse.data);
    console.log('Get application by ID test passed!\n');

    console.log('All API tests passed successfully!');
  } catch (error) {
    console.error('API test failed:', error.response ? error.response.data : error.message);
  }
};

// Run the tests
testApi();
