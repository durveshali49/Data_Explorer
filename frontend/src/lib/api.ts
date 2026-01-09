import axios from 'axios';
import type { Navigation, Category, Product, PaginatedProducts, ViewHistory } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Navigation API
export const navigationApi = {
  getAll: () => apiClient.get<Navigation[]>('/navigation').then(res => res.data),
  getById: (id: string) => apiClient.get<Navigation>(`/navigation/${id}`).then(res => res.data),
  getBySlug: (slug: string) => apiClient.get<Navigation>(`/navigation/slug/${slug}`).then(res => res.data),
  scrape: () => apiClient.post<Navigation[]>('/navigation/scrape').then(res => res.data),
};

// Category API
export const categoryApi = {
  getAll: (navigationId?: string, parentId?: string) =>
    apiClient.get<Category[]>('/categories', { params: { navigationId, parentId } }).then(res => res.data),
  getById: (id: string) => apiClient.get<Category>(`/categories/${id}`).then(res => res.data),
  getBySlug: (slug: string) => apiClient.get<Category>(`/categories/slug/${slug}`).then(res => res.data),
  scrape: (url: string, navigationId?: string, parentId?: string) =>
    apiClient.post<Category[]>('/categories/scrape', { url, navigationId, parentId }).then(res => res.data),
};

// Product API
export const productApi = {
  getAll: (params?: { categoryId?: string; page?: number; limit?: number }) =>
    apiClient.get<{ items: Product[]; total: number; page: number; limit: number }>('/products', { params })
      .then(res => res.data.items), // Extract items array
  getById: (id: string) => apiClient.get<Product>(`/products/${id}`).then(res => res.data),
  getBySourceId: (sourceId: string) => apiClient.get<Product>(`/products/source/${sourceId}`).then(res => res.data),
  scrape: (url: string, categoryId?: string, page?: number, limit?: number) =>
    apiClient.post<Product[]>('/products/scrape', { url, categoryId, page, limit }).then(res => res.data),
  scrapeDetail: (id: string) => apiClient.post(`/products/${id}/scrape-detail`).then(res => res.data),
};

// Scrape API
export const scrapeApi = {
  getJobs: (status?: string, limit?: number) =>
    apiClient.get('/scrape/jobs', { params: { status, limit } }),
  getJob: (id: string) => apiClient.get(`/scrape/jobs/${id}`),
  scrapeNavigation: () => apiClient.post('/scrape/navigation'),
  scrapeCategory: (url: string, navigationId?: string, parentId?: string) =>
    apiClient.post('/scrape/category', { url, navigationId, parentId }),
  scrapeProducts: (url: string, categoryId?: string, page?: number, limit?: number) =>
    apiClient.post('/scrape/products', { url, categoryId, page, limit }),
  scrapeProductDetail: (id: string) => apiClient.post(`/scrape/product/${id}/detail`),
};

// History API
export const historyApi = {
  create: (sessionId: string, pathJson: any, userId?: string) =>
    apiClient.post<ViewHistory>('/history', { sessionId, pathJson, userId }),
  getBySession: (sessionId: string, limit?: number) =>
    apiClient.get<ViewHistory[]>('/history/session', { params: { sessionId, limit } }),
  getByUser: (userId: string, limit?: number) =>
    apiClient.get<ViewHistory[]>('/history/user', { params: { userId, limit } }),
  getRecent: (limit?: number) =>
    apiClient.get<ViewHistory[]>('/history/recent', { params: { limit } }),
};

export default apiClient;
