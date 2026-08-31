# Nirmaan - Bugs Fixed and Improvements

During the comprehensive audit and implementation phase, several critical architectural and functional issues were resolved.

## 1. Vite 6 Environment Compatibility (ERR-VITE-01)
- **Issue:** The `figma-make-app` frontend template shipped with older ESM logic in `vite.config.ts`, causing catastrophic build failures referencing `__dirname is not defined in ES module scope`.
- **Resolution:** Replaced the legacy Node `__dirname` references with modern ESM `import.meta.dirname`, successfully enabling HMR and fast-refresh local development on port `8443`.

## 2. Protected Route Redirect Loop (ERR-01)
- **Issue:** Unauthorized users (like Admin or Manufacturer) attempting to access restricted buyer routes were unconditionally bounced to `/dashboard`. If `/dashboard` was also restricted, the app entered an infinite browser redirect loop.
- **Resolution:** `ProtectedRoute.tsx` logic was thoroughly audited and rewritten to smartly route users to their role-specific home pages (`/mfr/dashboard`, `/admin`, or `/dashboard`).

## 3. Disconnected Profile Settings (ERR-02)
- **Issue:** The `SettingsPage` was a simple hardcoded frontend stub within `AdditionalFlows.tsx`. User edits were superficial and lost upon refresh.
- **Resolution:** 
  - Segregated `SettingsPage.tsx` into a standalone, robust component.
  - Wired the component to `GET /api/v1/auth/me` to pre-load database info.
  - Tied form submission to `PUT /api/v1/auth/profile` allowing dynamic updates across Buyer and Manufacturer profiles.

## 4. Admin Dashboard Data Desert (ERR-03)
- **Issue:** The `AdminDashboard` and `PortalPages` components relied entirely on static array constants.
- **Resolution:** 
  - Authored new `GET /users` and `GET /manufacturers` API routes on the backend.
  - Linked the admin analytics cards to real Prisma counts via `GET /stats`.
  - Allowed admins to change Manufacturer verification status via the UI, successfully updating the database.

## 5. Localized Product Filtering (ERR-04)
- **Issue:** `Discover.tsx` applied frontend `Array.filter()` logic over a complete fetch of the product catalog, resulting in inefficient performance and potential client memory leaks.
- **Resolution:** 
  - Rebuilt the backend `ProductService.getProducts()` logic to ingest and process queries: `categories`, `moq`, `verified`, and `sort`.
  - Updated `Discover.tsx` to construct and dispatch `URLSearchParams` dynamically.
  - Added a 400ms Debounce wrapper around the search input to mitigate rapid-fire API hits.
