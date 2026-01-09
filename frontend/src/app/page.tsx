'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { navigationApi } from '@/lib/api';
import { BookOpen, Loader2 } from 'lucide-react';
import NavigationCard from '@/components/navigation/NavigationCard';
import Container from '@/components/ui/Container';

export default function HomePage() {
  const { data, error, isLoading } = useSWR(
    '/navigation',
    () => navigationApi.getAll().then(res => res.data),
    { revalidateOnFocus: false }
  );

  return (
    <Container>
      {/* Hero Section */}
      <section className="py-12 sm:py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <BookOpen className="w-16 h-16 text-primary-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Product Data Explorer
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover and explore products from World of Books. Navigate from categories to products with live, on-demand scraping.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about" className="btn-primary">
              Learn More
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Headings */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Browse by Category
        </h2>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading categories...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Failed to load navigation. Please try again later.</p>
          </div>
        )}

        {data && data.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">
              No navigation headings found. Please trigger a scrape to fetch data.
            </p>
          </div>
        )}

        {data && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((nav) => (
              <NavigationCard key={nav.id} navigation={nav} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-100 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Scraping</h3>
            <p className="text-gray-600">
              Real-time data fetching from World of Books with intelligent caching
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Navigation</h3>
            <p className="text-gray-600">
              Browse from headings to categories to products seamlessly
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Detailed Views</h3>
            <p className="text-gray-600">
              Complete product information including reviews and ratings
            </p>
          </div>
        </div>
      </section>
    </Container>
  );
}
