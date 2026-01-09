# Product Explorer - Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** 18+ and npm
- **PostgreSQL** 14+ (local or cloud-based like Railway/Render)
- **Redis** (optional, for job queue - can use cloud Redis)

## Setup Steps

### Backend Setup

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create PostgreSQL database
createdb product_explorer

# 3. Configure environment
cp .env.example .env

# Edit .env file with your PostgreSQL credentials:
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_USER=postgres
# DATABASE_PASSWORD=your_password
# DATABASE_NAME=product_explorer

# 4. Run migrations
npm run migration:run

# 5. (Optional) Seed database
npm run seed

# 6. Start development server
npm run start:dev

# Backend will run on http://localhost:3001
```

#### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# Edit .env file:
# NEXT_PUBLIC_API_URL=http://localhost:3001

# 3. Start development server
npm run dev

# Frontend will run on http://localhost:3000
```

## First Steps After Setup

### 1. Trigger Initial Scraping

Once the application is running, you need to populate the database with data from World of Books:

**Option A: Using the API directly**

```bash
# Scrape navigation headings
curl -X POST http://localhost:3001/api/scrape/navigation

# Scrape categories for a navigation heading
curl -X POST http://localhost:3001/api/scrape/category \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.worldofbooks.com/en-gb/books"}'

# Scrape products from a category
curl -X POST http://localhost:3001/api/scrape/products \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.worldofbooks.com/en-gb/books/fiction", "page": 1, "limit": 24}'
```

**Option B: Using the Swagger UI**

1. Navigate to http://localhost:3001/api/docs
2. Expand the "scrape" section
3. Try out the POST endpoints to trigger scraping

**Option C: Use seeded data**

If scraping fails or you want instant data:

```bash
# For Docker
docker-compose exec backend npm run seed

# For manual setup
cd backend && npm run seed
```

### 2. Browse the Application

1. Open http://localhost:3000 in your browser
2. Click on a navigation heading on the home page
3. Browse categories and products
4. Click on a product to see detailed information

## Development Workflow

### Running Tests

```bash
# Backend tests
cd backend
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:cov          # Coverage report

# Frontend tests
cd frontend
npm run test
npm run test:coverage
```

### Linting and Formatting

```bash
# Backend
cd backend
npm run lint
npm run format

# Frontend
cd frontend
npm run lint
```

### Database Operations

```bash
cd backend

# Generate a new migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Seed database
npm run seed
```

## Troubleshooting

### Database Connection Issues

**Problem:** Backend can't connect to PostgreSQL

**Solution:**
- Verify PostgreSQL is running: `pg_isready`
- Check connection details in `backend/.env`
- Ensure database exists: `psql -l | grep product_explorer`
- For Docker: `docker-compose logs postgres`

### Scraping Fails

**Problem:** Scraping endpoints return errors

**Solution:**
- Check your internet connection
- Verify World of Books website is accessible
- Review backend logs: `docker-compose logs backend` or check console
- The site structure may have changed - scrapers may need updates

### Port Conflicts

**Problem:** Ports 3000, 3001, 5432, or 6379 already in use

**Solution:**
- Stop conflicting services
- Or modify ports in docker-compose.yml and .env files

### Node Module Issues

**Problem:** Import errors or module not found

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Building for Production

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm start
```

### Environment Variables for Production

Ensure these are set in your production environment:

**Backend:**
- `NODE_ENV=production`
- `DATABASE_*` (your production database credentials)
- `REDIS_*` (if using Redis)
- `SCRAPE_*` (adjust rate limits and cache TTL as needed)

**Frontend:**
- `NEXT_PUBLIC_API_URL` (your deployed backend URL)

### Deployment Platforms

**Recommended:**
- **Backend:** Railway, Render, Heroku, Fly.io
- **Frontend:** Vercel, Netlify
- **Database:** Railway, Heroku Postgres, DigitalOcean

## API Documentation

Once the backend is running, comprehensive API documentation is available at:

**Local:** http://localhost:3001/api/docs
**Production:** [Your deployed backend URL]/api/docs

## Need Help?

- Check the main [README.md](./README.md) for architecture details
- Review API documentation at `/api/docs`
- Check logs: `docker-compose logs -f` or console output
- Open an issue on GitHub

---

**Happy exploring! 🚀**
