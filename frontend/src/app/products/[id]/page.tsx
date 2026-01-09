'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { productApi } from '@/lib/api';
import { Product, ProductDetail, Review } from '@/types';
import Container from '@/components/ui/Container';
import { formatPrice, formatDate } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const { data: product, error } = useSWR<Product & { detail?: ProductDetail; reviews?: Review[] }>(
    productId ? `/products/${productId}` : null,
    () => productApi.getById(productId)
  );

  if (error) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h1>
          <p className="text-gray-600">{error.message}</p>
          <Link href="/products" className="mt-6 inline-block text-blue-600 hover:underline">
            ← Back to Products
          </Link>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <div className="py-12 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg" />
            <div>
              <div className="h-10 w-3/4 bg-gray-200 rounded mb-4" />
              <div className="h-6 w-1/2 bg-gray-200 rounded mb-8" />
              <div className="h-40 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </Container>
    );
  }

  const { detail, reviews } = product;
  const averageRating = detail?.ratingsAvg || 0;
  const reviewCount = detail?.reviewsCount || reviews?.length || 0;

  return (
    <Container>
      <div className="py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.title}</h1>
            
            {product.author && (
              <p className="text-xl text-gray-600 mb-6">by {product.author}</p>
            )}

            {/* Rating */}
            {averageRating > 0 && (
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
                <span className="text-gray-600">({reviewCount} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="mb-8">
              <span className="text-4xl font-bold text-blue-600">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.condition && (
                <span className="ml-4 px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                  {product.condition}
                </span>
              )}
              {product.availability && (
                <div className="mt-3 text-green-600 font-medium">
                  ✓ {product.availability}
                </div>
              )}
            </div>

            {/* Description */}
            {detail?.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{detail.description}</p>
              </div>
            )}

            {/* Specs */}
            {detail && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
                {detail.isbn && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">ISBN</span>
                    <span className="font-medium text-gray-900">{detail.isbn}</span>
                  </div>
                )}
                {detail.publisher && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Publisher</span>
                    <span className="font-medium text-gray-900">{detail.publisher}</span>
                  </div>
                )}
                {detail.publicationDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Published</span>
                    <span className="font-medium text-gray-900">{detail.publicationDate}</span>
                  </div>
                )}
                {detail.pageCount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pages</span>
                    <span className="font-medium text-gray-900">{detail.pageCount}</span>
                  </div>
                )}
                {detail.format && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format</span>
                    <span className="font-medium text-gray-900">{detail.format}</span>
                  </div>
                )}
              </div>
            )}

            {/* CTA */}
            {product.sourceUrl && (
              <a
                href={product.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-4 rounded-lg transition"
              >
                View on World of Books →
              </a>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <div className="border-t pt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      {review.author && (
                        <span className="font-medium text-gray-900">{review.author}</span>
                      )}
                    </div>
                    {review.reviewDate && (
                      <span className="text-sm text-gray-500">{formatDate(review.reviewDate)}</span>
                    )}
                  </div>
                  {review.title && (
                    <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  )}
                  {review.text && (
                    <p className="text-gray-700">{review.text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {detail?.recommendations && Array.isArray(detail.recommendations) && detail.recommendations.length > 0 && (
          <div className="border-t pt-12 mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {detail.recommendations.slice(0, 4).map((rec: any, idx: number) => (
                <div key={idx} className="bg-white rounded-lg shadow-md p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{rec.title || rec}</h4>
                  {rec.price && (
                    <span className="text-blue-600 font-bold">{formatPrice(rec.price)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
