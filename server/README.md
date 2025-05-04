# FindIt - Job Application Platform

A job application platform built with the MEAN stack (MySQL, Express, Angular, Node.js).

## Backend Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)

### Installation

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=findit_db
   DB_PORT=3306
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
   LOG_LEVEL=debug
   ```
5. Create a MySQL database:
   ```sql
   CREATE DATABASE findit_db;
   ```

### Running the Server

Development mode with auto-reload:
```
npm run dev
```

Production mode:
```
npm start
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Jobs

- `GET /api/jobs` - Get all jobs (public)
- `GET /api/jobs/:id` - Get job by ID (public)
- `POST /api/jobs` - Create a new job (employer only)
- `PUT /api/jobs/:id` - Update job (employer only)
- `DELETE /api/jobs/:id` - Delete job (employer only)
- `GET /api/jobs/employer/me` - Get jobs posted by the current employer (employer only)

### Applications

- `POST /api/applications` - Apply for a job (job seeker only)
- `GET /api/applications/job/:jobId` - Get applications for a job (employer only)
- `PUT /api/applications/:id/status` - Update application status (employer only)
- `GET /api/applications/me` - Get user's applications (job seeker only)
- `GET /api/applications/:id` - Get application by ID (both employer and job seeker)

### Profile

- `PUT /api/profile` - Update user profile
- `GET /api/profile` - Get user profile

## Database Schema

### Users
- id (PK)
- email
- password (hashed)
- role (job_seeker, employer)
- created_at
- updated_at

### Profiles
- id (PK)
- user_id (FK)
- first_name
- last_name
- phone
- address
- resume_url (for job seekers)
- company_name (for employers)
- company_description (for employers)
- created_at
- updated_at

### Jobs
- id (PK)
- employer_id (FK)
- title
- description
- location
- salary_range
- job_type (full-time, part-time, contract)
- requirements
- status (active, closed)
- created_at
- updated_at

### Applications
- id (PK)
- job_id (FK)
- applicant_id (FK)
- status (applied, reviewed, interviewed, rejected, hired)
- cover_letter
- created_at
- updated_at
