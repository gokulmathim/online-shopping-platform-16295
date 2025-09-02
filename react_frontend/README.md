# Online Shopping Platform - Astro Frontend

Modern, responsive Astro frontend for browsing products, managing cart, authentication, checkout, and viewing orders. Styled with a clean light/dark theme and the palette:
- primary: #1976D2
- secondary: #424242
- accent: #FF4081

## Getting Started

1) Install
- npm install

2) Configure environment
- Copy .env.example to .env and set PUBLIC_API_BASE_URL to your Express backend URL.
- Example:
  PUBLIC_API_BASE_URL=http://localhost:3001

3) Run
- npm run dev
- Open http://localhost:3000

## Features
- Product catalog, search and filters
- Product details pages
- Shopping cart (add/update/remove/clear)
- Authentication (register/login)
- Checkout flow
- Order list and details
- Responsive, modern UI with theme toggle

## Notes
- JWT token is stored in localStorage as "token" for authenticated requests.
- API integration follows the backend OpenAPI documented endpoints.
