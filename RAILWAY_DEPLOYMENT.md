# Railway Deployment Guide

This application is configured to deploy on Railway.app with automatic MySQL database provisioning.

## Quick Start on Railway

### Step 1: Create Railway Account
- Go to https://railway.app
- Sign up with GitHub account
- Authorize Railway to access your repositories

### Step 2: Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Find and select `digital-banking-system`
- Click "Deploy Now"

### Step 3: Add MySQL Database
- In your Railway project dashboard
- Click "Add" (+ button)
- Search for "MySQL"
- Click "Add MySQL"
- Railway automatically creates database and environment variables

### Step 4: Configure Environment Variables

In Railway dashboard, go to your web service and add these secrets:

```
SECRET_JWT_SECRET=your_random_secret_key_here_min_32_chars
SECRET_NIBSS_API_KEY=your_nibss_api_key
SECRET_NIBSS_BANK_CODE=your_bank_code
SECRET_NIBSS_EMAIL=your_email@example.com
SECRET_NIBSS_BANK_NAME=Your Bank Name
```

### Step 5: Deploy
- Railway automatically detects Node.js
- Runs `npm install && npm run build`
- Starts with `npm run start:prod`
- Your app goes live!

## Environment Variables

### Automatic (Railway provides):
- `Mysql.MYSQL_HOST` - Database host
- `Mysql.MYSQL_PORT` - Database port
- `Mysql.MYSQL_USER` - Database username
- `Mysql.MYSQL_PASSWORD` - Database password
- `Mysql.MYSQL_DB` - Database name

### Manual (You add in Railway dashboard):
- `SECRET_JWT_SECRET` - JWT signing key
- `SECRET_NIBSS_API_KEY` - Nibss API key
- `SECRET_NIBSS_BANK_CODE` - Your bank code
- `SECRET_NIBSS_EMAIL` - Your email
- `SECRET_NIBSS_BANK_NAME` - Your bank name

## After Deployment

### Test Your API
```bash
# Your app will be at: https://<project-name>.up.railway.app

# Test health check
curl https://<project-name>.up.railway.app/healthz

# Expected response:
{
  "status": "ok",
  "timestamp": "2026-09-15T10:30:00Z",
  "uptime": 120.45,
  "environment": "production"
}
```

### View Logs
- In Railway dashboard, click your web service
- Click "Logs" tab
- See real-time application logs

### Monitor Database
- Click "Mysql" service in Railway
- View database metrics
- Connect via MySQL client if needed

## Useful Railway Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your Railway project
railway link

# View logs
railway logs

# Redeploy
railway up
```

## Troubleshooting

### App won't start
1. Check logs in Railway dashboard
2. Ensure all environment variables are set
3. Verify database connection

### Database not connecting
1. Ensure MySQL service is added
2. Check `DB_*` variables in Railway
3. Verify database credentials

### Build failures
1. Check Node.js version (requires 16+)
2. Verify package.json exists
3. Check build logs for errors

## Resources
- Railway Documentation: https://docs.railway.app
- GitHub Integration: https://docs.railway.app/guides/github
- MySQL on Railway: https://docs.railway.app/databases/mysql
