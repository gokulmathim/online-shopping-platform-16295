/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_BASE_URL: string; // Backend API base URL, e.g., http://localhost:3001
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
