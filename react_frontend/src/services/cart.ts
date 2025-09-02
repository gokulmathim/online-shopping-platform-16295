import { apiRequest } from './api';
import type { Product } from './products';

export interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
}

export interface Cart {
  items: CartItem[];
  subtotal?: number;
  currency?: string;
}

// PUBLIC_INTERFACE
export function getCart(): Promise<Cart> {
  /** Retrieves active cart for the current user. Requires auth. */
  return apiRequest<Cart>('/cart', { method: 'GET', auth: true });
}

// PUBLIC_INTERFACE
export function addToCart(productId: number, quantity = 1): Promise<Cart> {
  /** Adds an item to the cart. */
  return apiRequest<Cart>('/cart', { method: 'POST', auth: true, body: { productId, quantity } });
}

// PUBLIC_INTERFACE
export function updateCartItem(productId: number, quantity: number): Promise<Cart> {
  /** Updates an item quantity in the cart. */
  return apiRequest<Cart>('/cart', { method: 'PUT', auth: true, body: { productId, quantity } });
}

// PUBLIC_INTERFACE
export function removeFromCart(productId: number): Promise<Cart> {
  /** Removes an item from the cart. */
  return apiRequest<Cart>(`/cart/item/${productId}`, { method: 'DELETE', auth: true });
}

// PUBLIC_INTERFACE
export function clearCart(): Promise<Cart> {
  /** Clears the cart entirely. */
  return apiRequest<Cart>('/cart/clear', { method: 'DELETE', auth: true });
}
