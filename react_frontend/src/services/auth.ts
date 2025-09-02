import { apiRequest, setToken } from './api';

// PUBLIC_INTERFACE
export async function registerUser(payload: { name?: string; email: string; password: string }) {
  /** Registers a new user with name, email, password and stores token if returned. */
  const data = await apiRequest<{ token?: string; user?: unknown }>('/auth/register', {
    method: 'POST',
    body: payload,
    auth: false,
  });
  if (data?.token) setToken(data.token);
  return data;
}

// PUBLIC_INTERFACE
export async function loginUser(payload: { email: string; password: string }) {
  /** Logs in a user and stores JWT token. */
  const data = await apiRequest<{ token: string; user?: unknown }>('/auth/login', {
    method: 'POST',
    body: payload,
    auth: false,
  });
  if (data?.token) setToken(data.token);
  return data;
}

// PUBLIC_INTERFACE
export async function getCurrentUser() {
  /** Gets currently authenticated user. Requires Bearer token. */
  return apiRequest('/auth/me', { method: 'GET', auth: true });
}

// PUBLIC_INTERFACE
export function logout() {
  /** Clears token to log out user. */
  setToken(null);
}
