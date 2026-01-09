export interface Navigation {
  id: string;
  title: string;
  slug: string;
  description?: string;
  sourceUrl?: string;
  lastScrapedAt?: string;
  createdAt: string;
  updatedAt: string;
  categoryCount?: number;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
  navigationId?: string;
  parentId?: string;
  productCount: number;
  sourceUrl?: string;
  lastScrapedAt?: string;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
}

export interface Product {
  id: string;
  sourceId: string;
  title: string;
  author?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  sourceUrl: string;
  availability?: string;
  condition?: string;
  lastScrapedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetail {
  id: string;
  productId: string;
  description?: string;
  specs?: Record<string, any>;
  ratingsAvg?: number;
  reviewsCount: number;
  isbn?: string;
  publisher?: string;
  publicationDate?: string;
  pageCount?: number;
  format?: string;
  recommendations?: string[];
}

export interface Review {
  id: string;
  productId: string;
  author?: string;
  rating: number;
  text?: string;
  title?: string;
  reviewDate?: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ViewHistory {
  id: string;
  sessionId: string;
  pathJson: {
    navigation?: string;
    category?: string;
    product?: string;
    url: string;
    title: string;
  };
  createdAt: string;
}
