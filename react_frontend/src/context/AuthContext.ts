import { getCurrentUser, loginUser, logout as logoutSvc, registerUser } from '../services/auth';

export interface User {
  id?: number;
  email: string;
  name?: string;
  role?: string;
}

type Listener = () => void;

class AuthStore {
  user: User | null = null;
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

  async bootstrap() {
    this.loading = true;
    this.error = null;
    this.notify();
    try {
      const u = await getCurrentUser();
      this.user = u;
    } catch {
      this.user = null;
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  async login(email: string, password: string) {
    this.loading = true;
    this.error = null;
    this.notify();
    try {
      await loginUser({ email, password });
      const u = await getCurrentUser();
      this.user = u as User;
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message?: string }).message) : null;
      this.error = msg || 'Login failed';
      this.user = null;
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  async register(name: string, email: string, password: string) {
    this.loading = true;
    this.error = null;
    this.notify();
    try {
      await registerUser({ name, email, password });
      const u = await getCurrentUser();
      this.user = u as User;
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message?: string }).message) : null;
      this.error = msg || 'Registration failed';
      this.user = null;
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  signOut() {
    logoutSvc();
    this.user = null;
    this.notify();
  }
}

export const authStore = new AuthStore();
