# GARJA Fashion – Frontend

A modern e‑commerce frontend for GARJA Fashion built with Next.js (App Router), React, TypeScript, and Tailwind CSS. The app implements a complete shopping experience with product browsing, cart and wishlist, checkout, order tracking, and an admin area.

## Tech Stack

- Next.js `^15` (App Router) with TypeScript
- React `^19`
- Tailwind CSS `^4` with PostCSS and Autoprefixer
- Axios for HTTP
- Chart.js + react-chartjs-2 for admin analytics
- Next Image with Cloudinary remote patterns

Key configs:
- `next.config.js` – Cloudinary remote image pattern
- `tsconfig.json` – path alias `@/* -> ./src/*`
- `tailwind.config.js` – Tailwind v4 content paths and theme extensions
- `postcss.config.js` – Tailwind + Autoprefixer

## Scripts

Defined in `package.json`:

- `dev` – Start development server
- `build` – Build for production
- `start` – Start production server
- `lint` – Run Next.js lint

Run examples:

```bash
# install deps
npm install

# dev
npm run dev

# build
npm run build

# start prod
npm run start

# lint
npm run lint
```

## Environment Variables

Create `.env.local` in the project root. Example:

```
# Base API URL for all product and order requests
NEXT_PUBLIC_API_URL=https://api.mygarja.com

# Razorpay (example/test key). Do NOT commit real secrets.
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_public_key

# Server-side secret – must NOT be exposed to the browser.
# Move usage to server routes or backend; do not keep this in client-exposed envs.
RAZORPAY_KEY_SECRET=your_secret_key
```

Notes:
- Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Do not expose private secrets.
- This project currently reads `API_URL` from `NEXT_PUBLIC_API_URL` in services (see `src/services/productService.ts`).

## Project Structure

```
GARJA_FRONTEND/
├─ public/                     # Static public assets
├─ src/
│  ├─ app/                     # App Router routes and layouts
│  │  ├─ layout.tsx            # Root layout
│  │  ├─ page.tsx              # Home page
│  │  ├─ account-settings/
│  │  ├─ admin/                # Admin area (layout + pages)
│  │  ├─ cart/
│  │  ├─ checkout/
│  │  ├─ order-success/
│  │  ├─ orders/
│  │  ├─ product/              # Dynamic product routes (if any)
│  │  ├─ products/
│  │  ├─ test-storage/
│  │  ├─ user/
│  │  └─ wishlist/
│  ├─ components/              # Reusable UI components
│  │  ├─ AuthModal.tsx, Header.tsx, Footer.tsx, CartSidebar.tsx, ...
│  │  └─ admin/                # Admin-specific components
│  ├─ contexts/                # React context providers (Auth, Cart, etc.)
│  │  ├─ AuthContext.tsx
│  │  ├─ AdminAuthContext.tsx
│  │  ├─ CartContext.tsx
│  │  ├─ EnhancedCartContext.tsx
│  │  └─ ApiLoadingContext.tsx
│  ├─ services/                # API service layer (axios/fetch)
│  │  ├─ productService.ts
│  │  ├─ cartService.ts
│  │  ├─ orderService.ts
│  │  ├─ wishlistService.ts
│  │  ├─ adminProductService.ts
│  │  └─ adminOrderService.ts
│  ├─ utils/                   # Helpers/utilities
│  ├─ styles/                  # Global styles (Tailwind)
│  └─ types/                   # Shared TypeScript types
├─ API_Documentation.md        # API docs
├─ GARJA_API_DOCUMENTATION.md  # API docs (alt)
├─ next.config.js
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.json
├─ package.json
└─ README.md
```

## Features

- Product listing, category filters, search
- Product detail pages with images, sizes, stock handling
- Cart and wishlist with persistent state
- Checkout flow and order success page
- User account: orders, account settings
- Admin area for products and orders
- Loading states, notifications, and modals
- Image optimization with Next Image (Cloudinary remote support)

## Routing Overview

App Router pages in `src/app/`:
- `/` → `src/app/page.tsx`
- `/products` → `src/app/products/page.tsx`
- `/product/*` → `src/app/product/` (if dynamic routes are present)
- `/cart` → `src/app/cart/page.tsx`
- `/wishlist` → `src/app/wishlist/page.tsx`
- `/checkout` → `src/app/checkout/page.tsx`
- `/order-success` → `src/app/order-success/page.tsx`
- `/orders` → `src/app/orders/page.tsx`
- `/account-settings` → `src/app/account-settings/page.tsx`
- `/admin` → `src/app/admin/`

## Services and APIs

Most API calls are implemented under `src/services/` using Axios.
- Base URL derives from `process.env.NEXT_PUBLIC_API_URL` with a default `https://api.mygarja.com` (see `src/services/productService.ts`).
- Public endpoints example (from `productService.ts`):
  - `GET /public/getAllProducts`
  - `GET /public/getProductByCategory?category=...`
  - `GET /public/getLatestProducts`
  - `GET /public/getProductById/:id`

For a complete list of backend endpoints and payloads, see:
- `API_Documentation.md`
- `GARJA_API_DOCUMENTATION.md`

During development, services fall back to mocked data when an API error occurs (see `getMockProducts()` in `productService.ts`).

## Styling

- Tailwind CSS v4 configured via `tailwind.config.js` and PostCSS
- Custom theme tokens under `theme.extend` (`garja-*` colors, `Inter` font)

## Image Handling

`next.config.js` allows images from Cloudinary:
```js
images: {
  remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }]
}
```
Use Next.js `<Image />` for optimized images.

## Development

- Path alias: import internal modules via `@/` (e.g., `import { productService } from '@/services/productService'`)
- TypeScript strict mode enabled
- Lint via `npm run lint`

## Getting Started

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.local` and set values (see Environment Variables section).
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

## Build & Run Production

```bash
npm run build
npm run start
```

## Security Notes

- Do not commit real secrets. Use environment variables and a secure secret manager for production.
- Do not expose `RAZORPAY_KEY_SECRET` to the client. Move any secret usage to backend/server routes.

## Contribution

- Fork, create a feature branch, and open a PR.
- Ensure `npm run lint` passes and add appropriate tests or manual verification steps.

## License

This project is proprietary to GARJA Fashion. All rights reserved.
