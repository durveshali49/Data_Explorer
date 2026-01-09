'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { categoryApi, productApi } from '@/lib/api';
import { Category, Product } from '@/types';
import Container from '@/components/ui/Container';
import { formatPrice } from '@/lib/utils';

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params?.id as string;

  const { data: category, error: categoryError } = useSWR<Category>(
    categoryId ? `/categories/${categoryId}` : null,
    () => categoryApi.getById(categoryId)
  );

  const { data: products, error: productsError, isLoading: productsLoading } = useSWR<Product[]>(
    categoryId ? `/products?categoryId=${categoryId}` : null,
    () => productApi.getAll({ categoryId })
  );

  // Ensure products is always an array
  const productList = Array.isArray(products) ? products : [];

  if (categoryError || productsError) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Category</h1>
          <p className="text-gray-600">{categoryError?.message || productsError?.message}</p>
          <Link href="/categories" className="mt-6 inline-block text-blue-600 hover:underline">
            ← Back to Categories
          </Link>
        </div>
      </Container>
    );
  }

  if (!category) {
    return (
      <Container>
        <div className="py-12 animate-pulse">
          <div className="h-10 w-64 bg-gray-200 rounded mb-4" />
          <div className="h-6 w-96 bg-gray-200 rounded mb-12" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-blue-600">Categories</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{category.title}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{category.title}</h1>
          {category.description && (
            <p className="text-lg text-gray-600 mb-4">{category.description}</p>
          )}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{category.productCount || productList.length || 0} products</span>
            {category.lastScrapedAt && (
              <span>• Updated {new Date(category.lastScrapedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-64 bg-gray-200" />
                <div className="p-4">
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
                  <div className="h-6 w-20 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : !productList || productList.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Products Found</h2>
            <p className="text-gray-600 mb-6">This category doesn't have any products yet</p>
            <Link href="/categories" className="text-blue-600 hover:underline">
              ← Browse other categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productList.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                  )}
                  {product.condition && (
                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
                      {product.condition}
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition">
                    {product.title}
                  </h3>
                  {product.author && (
                    <p className="text-sm text-gray-600 mb-3">{product.author}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    {product.availability && (
                      <span className="text-xs text-green-600 font-medium">
                        {product.availability}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
