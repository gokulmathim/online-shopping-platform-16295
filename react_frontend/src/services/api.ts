/**
 * API client for backend communication.
 * Reads base URL from PUBLIC_API_BASE_URL env. Falls back to same origin.
 */
const API_BASE = import.meta.env.PUBLIC_API_BASE_URL || '';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

// PUBLIC_INTERFACE
export async function apiRequest<T = unknown>(
  path: string,
  options: { method?: HttpMethod; body?: unknown; headers?: Record<string, string>; auth?: boolean } = {},
): Promise<T> {
  /** Performs an HTTP request against the backend API with JSON handling and optional Bearer auth. */
  const method = options.method || 'GET';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // attach Bearer token if requested
  const auth = options.auth ?? true;
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const resp = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  });

  const contentType = resp.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await resp.json().catch(() => undefined) : await resp.text().catch(() => undefined);

  if (!resp.ok) {
    const err: ApiError = new Error((data && (data.message || data.error)) || 'API Error');
    err.status = resp.status;
    err.data = data;
    throw err;
  }

  return data as T;
}

// PUBLIC_INTERFACE
export function getToken(): string | null {
  /** Gets JWT token from localStorage. */
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function setToken(token: string | null): void {
  /** Sets or clears JWT token in localStorage. */
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}
