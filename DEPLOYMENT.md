# Product Explorer - Deployment Guide

## Overview

This guide covers deploying the Product Explorer platform to production. The application consists of:
- **Frontend:** Next.js application (recommended: Vercel)
- **Backend:** NestJS application (recommended: Railway/Render)
- **Database:** PostgreSQL (included with backend platform)
- **Cache:** Redis (optional, included with backend platform)

## Pre-Deployment Checklist

- [ ] Code is committed to GitHub repository
- [ ] All tests pass locally
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] .env files not committed (only .env.example)

## Backend Deployment

### Option 1: Railway (Recommended)

Railway provides PostgreSQL, Redis, and easy deployment.

#### Steps:

1. **Create Railway Account**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway auto-configures DATABASE_URL

4. **Add Redis** (Optional)
   - Click "New" → "Database" → "Add Redis"
   - Railway auto-configures REDIS_URL

5. **Configure Backend Service**
   - Select backend folder as root directory
   - Add environment variables:
     ```
     NODE_ENV=production
     PORT=3001
     SCRAPE_CACHE_TTL=3600
     SCRAPE_RATE_LIMIT=5
     SCRAPE_DELAY_MS=2000
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```

6. **Deploy**
   - Railway auto-deploys on push to main branch
   - Note your backend URL (e.g., https://your-app.railway.app)

7. **Run Migrations**
   - In Railway dashboard, open service
   - Go to "Settings" → "Deploy Command"
   - Add: `npm run migration:run && npm run start:prod`

### Option 2: Render

1. **Create Render Account**
   - Visit https://render.com

2. **Create PostgreSQL Database**
   - New → PostgreSQL
   - Note connection details

3. **Create Web Service**
   - New → Web Service
   - Connect GitHub repository
   - Configure:
     - Root Directory: `backend`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm run start:prod`

4. **Add Environment Variables**
   - Add all variables from .env.example
   - Use Render's PostgreSQL connection string

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   brew install heroku/brew/heroku  # macOS
   # or download from heroku.com
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Add Redis** (Optional)
   ```bash
   heroku addons:create heroku-redis:mini
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SCRAPE_CACHE_TTL=3600
   heroku config:set SCRAPE_RATE_LIMIT=5
   heroku config:set SCRAPE_DELAY_MS=2000
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **Run Migrations**
   ```bash
   heroku run npm run migration:run
   ```

## Frontend Deployment

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Steps:

1. **Create Vercel Account**
   - Visit https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select "frontend" folder as root directory

3. **Configure Build Settings**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `frontend`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel automatically redeploys on push to main branch
   - Note your frontend URL (e.g., https://your-app.vercel.app)

6. **Update Backend CORS**
   - Add your Vercel URL to backend's FRONTEND_URL environment variable

### Option 2: Netlify

1. **Create Netlify Account**
   - Visit https://netlify.com

2. **Import Project**
   - New site from Git
   - Connect GitHub repository
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Environment Variables**
   - Site settings → Environment variables
   - Add `NEXT_PUBLIC_API_URL`

4. **Deploy**

## Post-Deployment Steps

### 1. Update CORS Settings

Ensure your backend allows requests from your frontend domain:

**Backend environment variable:**
```
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 2. Test Deployment

Visit your deployed frontend and verify:
- [ ] Home page loads
- [ ] Navigation works
- [ ] API calls succeed
- [ ] Scraping triggers work

### 3. Seed Initial Data

Trigger initial scraping via your deployed API:

```bash
# Using curl
curl -X POST https://your-backend-url.railway.app/api/scrape/navigation

# Or use the Swagger UI
https://your-backend-url.railway.app/api/docs
```

### 4. Monitor Application

- Check backend logs for errors
- Monitor database usage
- Set up alerts (optional)

## Custom Domain (Optional)

### Frontend (Vercel)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Backend (Railway)

1. Go to Service Settings → Networking
2. Add custom domain
3. Configure DNS records

## Environment Variables Reference

### Backend (.env)

```env
# Required
NODE_ENV=production
PORT=3001
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_NAME=product_explorer

# Optional but recommended
REDIS_HOST=your-redis-host
REDIS_PORT=6379

# Scraping configuration
SCRAPE_CACHE_TTL=3600
SCRAPE_RATE_LIMIT=5
SCRAPE_DELAY_MS=2000

# CORS
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (.env)

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

## Troubleshooting Deployment

### Backend Issues

**Problem:** Migration errors on deployment
**Solution:** 
- Ensure database is created
- Check DATABASE_URL is correctly set
- Manually run migrations via platform CLI

**Problem:** CORS errors
**Solution:**
- Verify FRONTEND_URL is set correctly
- Check frontend URL matches exactly (including https://)

**Problem:** Scraping timeouts
**Solution:**
- Increase timeout settings in hosting platform
- Check if platform allows outbound HTTP requests

### Frontend Issues

**Problem:** API calls fail
**Solution:**
- Verify NEXT_PUBLIC_API_URL is set correctly
- Check if backend is running and accessible
- Verify CORS is configured on backend

**Problem:** Build fails
**Solution:**
- Check all dependencies are in package.json
- Ensure Node version matches (18+)
- Review build logs for specific errors

## Scaling Considerations

### Performance Optimization

1. **Database:**
   - Add indexes on frequently queried columns
   - Enable connection pooling
   - Consider read replicas for high traffic

2. **Caching:**
   - Use Redis for API response caching
   - Implement CDN for frontend assets
   - Cache scraped data aggressively

3. **Backend:**
   - Enable compression
   - Implement rate limiting per user
   - Use queue workers for scraping jobs

4. **Frontend:**
   - Enable Next.js ISR (Incremental Static Regeneration)
   - Optimize images with Next/Image
   - Implement lazy loading

## Monitoring & Maintenance

### Recommended Tools

- **Error Tracking:** Sentry
- **Monitoring:** Railway/Render built-in metrics
- **Logging:** Built-in platform logs
- **Uptime:** UptimeRobot

### Regular Maintenance

- Monitor scraping job success rates
- Clean old browsing history (30+ days)
- Update dependencies monthly
- Review and optimize database queries
- Backup database regularly

## Cost Estimates

### Free Tier Deployment

- **Railway:** Free tier (limited hours) or ~$5-10/month
- **Vercel:** Free for hobby projects
- **Total:** $0-10/month for low traffic

### Production Deployment

- **Railway/Render:** ~$20-50/month
- **Database:** Included or ~$10/month
- **Redis:** Included or ~$10/month
- **Vercel Pro:** $20/month (if needed)
- **Total:** ~$40-90/month

## Submission Checklist

Before submitting via the Google Form:

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] API documentation accessible at /api/docs
- [ ] Database has some data (seeded or scraped)
- [ ] All features demonstrated working
- [ ] GitHub repository is public or access granted
- [ ] README has deployment links updated
- [ ] Both deployment URLs tested and working

## Links to Update

After deployment, update these locations with your URLs:

1. **README.md:** Update "🔗 Links" section
2. **frontend/src/app/contact/page.tsx:** Update project links
3. **Google Form:** Submit both frontend and backend URLs

---

**Congratulations on deploying your Product Explorer! 🎉**
