import { apiRequest } from './api';

export interface OrderSummary {
  id: number;
  status: string;
  total: number;
  createdAt?: string;
  currency?: string;
}

export interface OrderDetail extends OrderSummary {
  items: Array<{ productId: number; title?: string; quantity: number; price: number }>;
  shippingAddress?: any;
  payment?: any;
}

// PUBLIC_INTERFACE
export function checkout(): Promise<{ orderId?: number } & Partial<OrderDetail>> {
  /** Performs checkout for current user's cart. */
  return apiRequest('/orders/checkout', { method: 'POST', auth: true });
}

// PUBLIC_INTERFACE
export function listOrders(params: { limit?: number; offset?: number } = {}): Promise<{ items: OrderSummary[]; total?: number }> {
  /** Lists current user's orders. */
  const query = new URLSearchParams();
  if (params.limit != null) query.set('limit', String(params.limit));
  if (params.offset != null) query.set('offset', String(params.offset));
  const path = query.toString() ? `/orders?${query}` : '/orders';

  type OrdersApiShape =
    | OrderSummary[]
    | { items: OrderSummary[]; total?: number }
    | { data?: OrderSummary[]; total?: number };

  function hasItems(x: unknown): x is { items: OrderSummary[]; total?: number } {
    if (typeof x !== 'object' || x === null) return false;
    const obj = x as Record<string, unknown>;
    return Object.prototype.hasOwnProperty.call(obj, 'items');
  }
  function hasData(x: unknown): x is { data?: OrderSummary[]; total?: number } {
    if (typeof x !== 'object' || x === null) return false;
    const obj = x as Record<string, unknown>;
    return Object.prototype.hasOwnProperty.call(obj, 'data');
  }

  return apiRequest<OrdersApiShape>(path, { method: 'GET', auth: true }).then((data) => {
    if (Array.isArray(data)) return { items: data };
    if (hasItems(data)) return { items: data.items, total: data.total };
    if (hasData(data)) return { items: data.data || [], total: data.total };
    return { items: [] };
  });
}

// PUBLIC_INTERFACE
export function getOrder(id: number): Promise<OrderDetail> {
  /** Gets order details by id. */
  return apiRequest(`/orders/${id}`, { method: 'GET', auth: true });
}
