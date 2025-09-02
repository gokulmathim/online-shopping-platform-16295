import { apiRequest } from './api';

export interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  stock?: number;
}

export interface ProductQuery {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}

// PUBLIC_INTERFACE
export async function listProducts(query: ProductQuery = {}): Promise<{ items: Product[]; total?: number }> {
  /** Gets a list of products with optional search and filter query. */
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
  });
  const path = params.toString() ? `/products?${params}` : '/products';
  const data = await apiRequest<unknown>(path, { method: 'GET', auth: false });
  // Normalize data shape
  if (Array.isArray(data)) return { items: data };
  return { items: data?.items || data?.data || [], total: data?.total };
}

// PUBLIC_INTERFACE
export async function getProduct(id: number): Promise<Product> {
  /** Gets a single product by id. */
  return apiRequest<Product>(`/products/${id}`, { method: 'GET', auth: false });
}
