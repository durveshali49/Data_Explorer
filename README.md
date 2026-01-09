# Product Data Explorer

A production-minded product exploration platform for browsing and discovering products from World of Books.

## 🎯 Features

- **Smart Navigation**: Browse from high-level headings → categories → products → detailed pages
- **Live Scraping**: Real-time, on-demand data fetching from World of Books
- **Intelligent Caching**: Avoid excessive scraping with TTL-based caching
- **Responsive Design**: Mobile-first, accessible UI with smooth transitions
- **Browsing History**: Track and persist user navigation paths
- **Product Details**: Complete information including reviews, ratings, and recommendations

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- SWR for data fetching
- Responsive & accessible design

**Backend:**
- NestJS (Node.js + TypeScript)
- PostgreSQL (production database)
- Crawlee + Playwright (web scraping)
- TypeORM (database ORM)
- Bull (job queue)
- Swagger/OpenAPI documentation

**Infrastructure:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Rate limiting & backoff strategies

### Project Structure

```
Data Explorer/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/      # App router pages
│   │   ├── components/
│   │   ├── lib/      # Utilities & API client
│   │   └── types/
│   └── package.json
├── backend/           # NestJS application
│   ├── src/
│   │   ├── modules/  # Feature modules
│   │   ├── scraper/  # Crawlee scraping logic
│   │   └── database/ # Database entities
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+ (or use a managed service like Railway/Render)
- Redis 7+ (optional, for job queue)

### Local Setup

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Run migrations
npm run migration:run

# Seed database (optional)
npm run seed

# Start development server
npm run start:dev

# Backend runs on http://localhost:3001
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with backend API URL

# Start development server
npm run dev

# Frontend runs on http://localhost:3000
```

## 📦 Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=3001

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=product_explorer

# Redis (optional, for caching)
REDIS_HOST=localhost
REDIS_PORT=6379

# Scraping
SCRAPE_CACHE_TTL=3600
SCRAPE_RATE_LIMIT=5
SCRAPE_DELAY_MS=2000
```

### Frontend (.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🗄️ Database Schema

### Core Entities

- **navigation**: Top-level navigation headings
- **category**: Categories and subcategories (self-referential)
- **product**: Product listings with basic info
- **product_detail**: Extended product information
- **review**: User reviews and ratings
- **scrape_job**: Scraping job tracking
- **view_history**: User browsing history

### Relationships

```
navigation 1--* category
category 1--* category (parent-child)
category 1--* product
product 1--1 product_detail
product 1--* review
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:cov          # Coverage

# Frontend tests
cd frontend
npm run test
npm run test:coverage
```

## 📚 API Documentation

API documentation is available via Swagger UI when the backend is running:

**Local**: http://localhost:3001/api
**Production**: [Your deployed backend URL]/api

### Key Endpoints

```
GET  /api/navigation              # Get all navigation headings
GET  /api/categories              # Get categories
GET  /api/categories/:id          # Get category details
GET  /api/products                # Get products (paginated)
GET  /api/products/:id            # Get product details
POST /api/scrape/navigation       # Trigger navigation scrape
POST /api/scrape/category/:id     # Trigger category scrape
POST /api/scrape/product/:id      # Trigger product scrape
GET  /api/history                 # Get browsing history
POST /api/history                 # Save browsing history
```

## 🛡️ Ethical Scraping

This application implements responsible scraping practices:

- ✅ Respects robots.txt
- ✅ Rate limiting with delays (2s between requests)
- ✅ Exponential backoff on failures
- ✅ Aggressive caching to minimize requests
- ✅ User-Agent identification
- ✅ Queue-based job processing

## 🚢 Deployment

### Backend Deployment

The backend can be deployed to:
- Railway
- Render
- Heroku
- Fly.io
- DigitalOcean App Platform

Ensure environment variables are set in your deployment platform.

### Frontend Deployment

The frontend is optimized for Vercel deployment:

```bash
cd frontend
npm run build
# Deploy to Vercel, Netlify, or other platforms
```

## 🔧 Design Decisions

### Why PostgreSQL?
- Strong relational model for navigation → categories → products
- ACID compliance for data integrity
- Excellent JSON support for flexible metadata
- Robust indexing and query performance

### Why Crawlee + Playwright?
- Modern scraping framework with queue management
- Headless browser support for JavaScript-rendered content
- Built-in retries and error handling
- Request throttling and deduplication

### Why SWR?
- Stale-while-revalidate strategy for optimal UX
- Built-in caching and request deduplication
- Optimistic UI updates
- Lightweight and performant

## 📝 Development Workflow

### Adding a New Feature

1. **Backend**: Create module, service, controller, DTO
2. **Database**: Add/update entities, create migration
3. **Frontend**: Create page/component, add API integration
4. **Tests**: Write unit and integration tests
5. **Documentation**: Update README and Swagger docs

### Database Migrations

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for your portfolio or learning.

## 🔗 Links

- **GitHub Repository**: [Your repo URL]
- **Live Frontend**: [Your deployed frontend URL]
- **Live Backend**: [Your deployed backend URL]
- **API Documentation**: [Your backend URL]/api

## 👨‍💻 Author

[Your Name]

## 🙏 Acknowledgments

- World of Books for product data
- NestJS and Next.js communities
- Crawlee team for the excellent scraping framework

---

**Built with ❤️ for the full-stack engineering assessment**
