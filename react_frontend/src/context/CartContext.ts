import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from '../services/cart';
import type { Cart } from '../services/cart';

type Listener = () => void;

class CartStore {
  cart: Cart | null = null;
  loading = false;
  error: string | null = null;
  private listeners: Listener[] = [];

  subscribe(fn: Listener) {
    this.listeners.push(fn);
    return () => (this.listeners = this.listeners.filter((l) => l !== fn));
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  async refresh() {
    this.loading = true;
    this.error = null;
    this.notify();
    try {
      this.cart = await getCart();
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message?: string }).message) : null;
      this.error = msg || 'Failed to load cart';
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  async add(productId: number, quantity = 1) {
    this.loading = true;
    this.notify();
    try {
      this.cart = await addToCart(productId, quantity);
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message?: string }).message) : null;
      this.error = msg || 'Failed to add to cart';
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  async update(productId: number, quantity: number) {
    this.loading = true;
    this.notify();
    try {
      this.cart = await updateCartItem(productId, quantity);
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message?: string }).message) : null;
      this.error = msg || 'Failed to update cart';
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  async remove(productId: number) {
    this.loading = true;
    this.notify();
    try {
      this.cart = await removeFromCart(productId);
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message?: string }).message) : null;
      this.error = msg || 'Failed to remove from cart';
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  async clear() {
    this.loading = true;
    this.notify();
    try {
      this.cart = await clearCart();
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message?: string }).message) : null;
      this.error = msg || 'Failed to clear cart';
    } finally {
      this.loading = false;
      this.notify();
    }
  }
}

export const cartStore = new CartStore();
