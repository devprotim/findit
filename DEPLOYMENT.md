# FindIt - Vercel Deployment Guide

This guide will help you deploy your FindIt application to Vercel.

## Prerequisites

1. **Vercel Account**: Make sure you have a Vercel account set up
2. **Database**: You'll need a production MySQL database (consider services like PlanetScale, Railway, or AWS RDS)
3. **Vercel CLI** (optional): Install with `npm i -g vercel`

## Project Structure

Your project is now configured as a monorepo with:
- `client/` - Angular frontend
- `server/` - Node.js/Express backend
- `api/` - Vercel serverless functions entry point
- `vercel.json` - Vercel deployment configuration

## Environment Variables Setup

### Required Environment Variables for Vercel

Set these in your Vercel dashboard (Project Settings → Environment Variables):

```bash
# Database Configuration
DB_HOST=your_production_database_host
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=findit_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=1d

# Application Configuration
NODE_ENV=production
LOG_LEVEL=info

# Optional: CORS Configuration
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

### Database Setup

1. **Create a production MySQL database** using one of these services:
   - [PlanetScale](https://planetscale.com/) (Recommended - serverless MySQL)
   - [Railway](https://railway.app/)
   - [AWS RDS](https://aws.amazon.com/rds/)
   - [Google Cloud SQL](https://cloud.google.com/sql)

2. **Get your database connection details** and add them to Vercel environment variables

3. **Initialize your database** by running your database initialization scripts on the production database

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect your repository** to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository

2. **Configure the project**:
   - Root Directory: Leave as default (root)
   - Framework Preset: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: `client/dist/client`

3. **Add environment variables** in Project Settings

4. **Deploy**: Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   vercel
   ```

4. **Follow the prompts** and configure environment variables when prompted

## Build Process

The deployment process will:

1. **Install dependencies** for both client and server
2. **Build the Angular application** for production
3. **Create serverless functions** from your Express API
4. **Deploy static files** and API endpoints

## Post-Deployment

### 1. Database Initialization

After deployment, you may need to initialize your production database:

```bash
# If you have database initialization scripts
# Run them against your production database
```

### 2. Test Your Deployment

1. **Frontend**: Visit your Vercel app URL
2. **API**: Test API endpoints at `https://your-app.vercel.app/api/`
3. **Database**: Verify database connections work

### 3. Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Navigate to Settings → Domains
3. Add your custom domain

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Verify environment variables are set correctly
   - Check database host allows connections from Vercel IPs
   - Ensure database credentials are correct

2. **API Routes Not Working**:
   - Check that API routes start with `/api/`
   - Verify serverless function timeout settings
   - Check Vercel function logs

3. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are listed in package.json
   - Check build logs for specific errors

### Debugging

1. **Check Vercel Function Logs**:
   - Go to your project dashboard
   - Navigate to Functions tab
   - Click on individual functions to see logs

2. **Local Testing**:
   ```bash
   # Test the build process locally
   npm run vercel-build
   
   # Test the API locally
   cd server && npm start
   ```

## Performance Optimization

1. **Database Connection Pooling**: Already configured for serverless
2. **Static Asset Optimization**: Angular build handles this
3. **API Response Caching**: Consider implementing for frequently accessed data

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **CORS Configuration**: Properly configured for your domain
3. **JWT Secret**: Use a strong, unique secret in production
4. **Database Security**: Use strong passwords and restrict access

## Monitoring

Consider setting up:
1. **Vercel Analytics**: Built-in performance monitoring
2. **Error Tracking**: Services like Sentry
3. **Database Monitoring**: Your database provider's monitoring tools

## Support

If you encounter issues:
1. Check Vercel documentation
2. Review function logs in Vercel dashboard
3. Test API endpoints individually
4. Verify environment variables are set correctly
