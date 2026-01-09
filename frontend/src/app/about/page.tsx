import Container from '@/components/ui/Container';
import { BookOpen, Code, Database, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Product Explorer</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            A production-minded product exploration platform built for discovering and browsing products from World of Books.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-700 mb-4">
              Product Explorer is a full-stack application that demonstrates modern web development practices,
              combining real-time web scraping with a responsive, accessible user interface. The platform allows
              users to navigate from high-level headings through categories to detailed product pages, all powered
              by live, on-demand data fetching.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology Stack</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <Code className="w-8 h-8 text-primary-600 mr-3" />
                  <h3 className="text-xl font-semibold">Frontend</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Next.js 14 (App Router)</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• SWR for data fetching</li>
                  <li>• Responsive & accessible design</li>
                </ul>
              </div>

              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <Database className="w-8 h-8 text-primary-600 mr-3" />
                  <h3 className="text-xl font-semibold">Backend</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• NestJS (Node.js + TypeScript)</li>
                  <li>• PostgreSQL database</li>
                  <li>• TypeORM for data modeling</li>
                  <li>• Bull for job queues</li>
                  <li>• Swagger API documentation</li>
                </ul>
              </div>

              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <Globe className="w-8 h-8 text-primary-600 mr-3" />
                  <h3 className="text-xl font-semibold">Scraping</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Crawlee framework</li>
                  <li>• Playwright (headless browser)</li>
                  <li>• Rate limiting & backoff</li>
                  <li>• Intelligent caching (TTL)</li>
                  <li>• Ethical scraping practices</li>
                </ul>
              </div>

              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-8 h-8 text-primary-600 mr-3" />
                  <h3 className="text-xl font-semibold">Infrastructure</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Docker & Docker Compose</li>
                  <li>• GitHub Actions CI/CD</li>
                  <li>• Redis for caching</li>
                  <li>• Unit & E2E tests</li>
                  <li>• Production deployments</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>Live Scraping:</strong> Real-time data fetching from World of Books with on-demand updates</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>Smart Caching:</strong> Intelligent TTL-based caching to minimize scraping requests</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>Responsive Design:</strong> Mobile-first, accessible interface with smooth transitions</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>Browsing History:</strong> Track user navigation paths across sessions</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>Product Details:</strong> Complete information including reviews, ratings, and recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>Pagination:</strong> Efficient handling of large product catalogs</span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ethical Scraping</h2>
            <p className="text-gray-700 mb-4">
              This application implements responsible web scraping practices to ensure minimal impact on the source website:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Respects robots.txt directives</li>
              <li>• Implements rate limiting (delays between requests)</li>
              <li>• Uses exponential backoff on failures</li>
              <li>• Aggressive caching to minimize requests</li>
              <li>• Identifies itself with a proper User-Agent</li>
              <li>• Queue-based job processing to avoid overwhelming servers</li>
            </ul>
          </section>
        </div>
      </div>
    </Container>
  );
}
