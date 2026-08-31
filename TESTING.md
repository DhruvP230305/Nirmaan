# Nirmaan - QA & Testing Guide

This document outlines the testing workflow you can follow to verify the full-stack integrity of Nirmaan.

## 1. Role-Based Navigation & Security
1. Navigate to `http://localhost:8443/login`.
2. Login using Buyer credentials. Verify successful navigation to `/dashboard`.
3. Manually modify the URL to `/admin`.
4. Observe the `ProtectedRoute` bounce the user immediately back to `/dashboard`.
5. Repeat the process for Manufacturer accounts to ensure they are constrained to `/mfr/*` routes.

## 2. Dynamic Settings & Profile Updates
1. Login as a Buyer and navigate to `Settings` via the Sidebar.
2. Update the `City` and `Business Type` fields.
3. Click "Save Changes". Note the success UI message.
4. Refresh the page entirely. Verify the fields repopulate from the database securely.
5. Login as a Manufacturer and repeat, observing the unique Manufacturer-specific fields like `Factory Name` and `Production Capacity`.

## 3. Product Discovery Filters
1. Open the `/discover` route.
2. In the sidebar, select the `Necklaces` category filter.
3. Verify the product grid instantly refines without a page reload (via dynamic Backend querying).
4. Enter `silver` into the Search Bar.
5. Pause typing. Notice the 400ms debounce before the grid elegantly loads new results.

## 4. Admin Management Console
1. Login as an Admin and navigate to `/admin`.
2. View the unified `Stats` dashboard to see real Database aggregates for Users, Products, and RFQs.
3. Navigate to `Pending Verifications`.
4. Click `Approve` on a pending manufacturer.
5. Navigate to the `Manufacturers` sub-panel (`/admin/manufacturers`).
6. Verify the manufacturer now accurately reflects their elevated `VERIFIED` status.
