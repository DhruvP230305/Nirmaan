# D2C Sourcing & Manufacturing Platform — AI Development Specification

## 1. Project Overview

Build a B2B sourcing and manufacturing platform for small and new D2C/online businesses.

### Core problem

Small businesses such as Instagram jewellery stores, Shopify stores, Meesho sellers, and other new D2C brands often struggle to:

- Find reliable manufacturers.
- Find suppliers accepting low MOQ orders.
- Compare manufacturers and quotations.
- Verify supplier quality and business legitimacy.
- Order samples before bulk production.
- Request custom manufacturing.
- Find packaging and branding suppliers.
- Coordinate production, packaging, and logistics.

### Core solution

The platform should eventually provide a complete sourcing journey:

**Product Idea → Find Manufacturer → Request Sample → Compare Quotes → Manufacture → Packaging → Shipping → Ready-to-Sell Product**

The long-term vision is:

> **From Product Idea to Ready-to-Sell Business.**

### Initial target market

Start with:

- Fashion jewellery
- Earrings
- Necklaces
- Bracelets
- Rings
- Jewellery accessories
- Packaging for small jewellery/D2C brands

Do NOT initially build a marketplace for every industry.

---

# 2. Current Development Scope

## IMPORTANT

### Focus ONLY on the backend right now.

Do not start frontend development unless explicitly requested.

Do not implement the complete platform at once.

The backend must be developed incrementally as a modular monolith.

### Current priority

Build the backend foundation first, then:

1. Database
2. Authentication
3. User roles
4. Manufacturer profiles
5. Product catalogue
6. Search/filtering
7. Buyer requirements/RFQ
8. Manufacturer quotations
9. Sample requests
10. Orders
11. Payments
12. Reviews/trust
13. Packaging/business kits
14. Notifications
15. Admin

Features should be implemented in this order unless a technical dependency requires otherwise.

---

# 3. Technology Stack

## Backend

- Node.js
- TypeScript
- Express.js
- REST API

## Database

- PostgreSQL
- Prisma ORM

## Authentication

Initial planned approach:

- JWT
- bcrypt/Argon2 for password hashing
- Role-based authorization

Roles:

- BUYER
- MANUFACTURER
- ADMIN

## Validation

- Zod

## File Storage

Planned:

- Cloudinary initially
- AWS S3 can be considered later if scale requires it

Files may include:

- Product images
- Manufacturer documents
- GST/business verification documents
- Sample/product images
- Packaging images

## Payments

Planned:

- Razorpay

Do not integrate payments until the order workflow is stable.

## Notifications

Initial:

- Email

Future:

- WhatsApp
- SMS
- In-app notifications

## Hosting

Initial:

- Backend: Render/Railway or equivalent
- Database: Supabase PostgreSQL or managed PostgreSQL

Final hosting can be changed later based on cost and scalability requirements.

---

# 4. Architecture

Use a modular monolith.

Do NOT use microservices for the MVP.

Recommended architecture:

```text
Client / Future Frontend
        |
        v
   REST API
        |
        v
     Routes
        |
        v
   Controllers
        |
        v
    Services
        |
        v
 Prisma ORM
        |
        v
 PostgreSQL
```

Supporting components:

```text
Backend
 |
 +-- Authentication
 +-- Authorization
 +-- Validation
 +-- File Storage
 +-- Payments
 +-- Notifications
 +-- Logging
 +-- Error Handling
```

## Architecture principles

- Keep routes thin.
- Controllers handle HTTP request/response logic.
- Services contain business logic.
- Prisma handles database access.
- Middleware handles authentication, authorization, validation, and common request processing.
- Utilities contain reusable helper functions.
- Do not put business logic directly inside route files.
- Do not directly access Prisma from frontend/client code.
- Keep modules independent enough that they can be extracted into services later if necessary.

---

# 5. Backend Folder Structure

Use this structure as the project grows:

```text
backend/
│
├── src/
│   ├── config/
│   │   ├── env.ts
│   │   └── database.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── manufacturer.controller.ts
│   │   ├── product.controller.ts
│   │   ├── requirement.controller.ts
│   │   ├── quote.controller.ts
│   │   ├── sample.controller.ts
│   │   ├── order.controller.ts
│   │   ├── payment.controller.ts
│   │   ├── review.controller.ts
│   │   ├── packaging.controller.ts
│   │   └── admin.controller.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── manufacturer.routes.ts
│   │   ├── product.routes.ts
│   │   ├── requirement.routes.ts
│   │   ├── quote.routes.ts
│   │   ├── sample.routes.ts
│   │   ├── order.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── review.routes.ts
│   │   ├── packaging.routes.ts
│   │   └── admin.routes.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── manufacturer.service.ts
│   │   ├── product.service.ts
│   │   ├── requirement.service.ts
│   │   ├── quote.service.ts
│   │   ├── sample.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts
│   │   ├── review.service.ts
│   │   ├── packaging.service.ts
│   │   └── notification.service.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── upload.middleware.ts
│   │
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── product.validator.ts
│   │   ├── requirement.validator.ts
│   │   ├── quote.validator.ts
│   │   └── order.validator.ts
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── api-response.ts
│   │   └── logger.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── tests/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

Do not create every file immediately if it is not needed. Create modules progressively.

---

# 6. Database Design

The database should support the following main entities.

## User

Fields:

- id
- name
- email
- phone
- passwordHash
- role
- createdAt
- updatedAt

Roles:

```text
BUYER
MANUFACTURER
ADMIN
```

---

## Manufacturer

Fields should eventually include:

- id
- userId
- businessName
- description
- businessType
- location
- address
- GST number
- verificationStatus
- rating
- createdAt
- updatedAt

Verification statuses:

```text
PENDING
VERIFIED
REJECTED
```

---

## Product

Fields:

- id
- manufacturerId
- name
- description
- category
- price
- moq
- stock
- productionTime
- customizationAvailable
- sampleAvailable
- createdAt
- updatedAt

Product images should be stored using a file-storage service rather than directly inside PostgreSQL.

---

## Requirement / RFQ

This is one of the most important entities.

A buyer should be able to post:

> I need 200 earrings under ₹50 per piece.

Fields:

- id
- buyerId
- category
- description
- quantity
- targetPrice
- location
- customizationRequired
- sampleRequired
- deadline
- status
- createdAt
- updatedAt

Statuses may include:

```text
OPEN
QUOTED
ACCEPTED
CLOSED
CANCELLED
```

---

## Quote

Fields:

- id
- requirementId
- manufacturerId
- price
- quantity
- productionTime
- message
- status
- createdAt
- updatedAt

Statuses:

```text
PENDING
ACCEPTED
REJECTED
WITHDRAWN
```

Workflow:

```text
Buyer Requirement
       |
       v
Manufacturers
       |
       v
Multiple Quotes
       |
       v
Buyer Compares
       |
       v
Buyer Accepts Quote
```

---

## SampleRequest

Fields:

- id
- buyerId
- manufacturerId
- productId
- quantity
- price
- shippingCost
- status
- trackingNumber
- createdAt
- updatedAt

Statuses:

```text
REQUESTED
ACCEPTED
SHIPPED
DELIVERED
APPROVED
REJECTED
CANCELLED
```

---

## Order

Fields:

- id
- buyerId
- manufacturerId
- quoteId
- totalAmount
- status
- shippingAddress
- trackingNumber
- createdAt
- updatedAt

Statuses:

```text
PENDING
CONFIRMED
PAYMENT_PENDING
PAID
IN_PRODUCTION
PACKAGING
SHIPPED
DELIVERED
CANCELLED
```

---

## Payment

Fields:

- id
- orderId
- amount
- provider
- providerPaymentId
- status
- createdAt
- updatedAt

Do not trust frontend payment-success messages. Verify payment server-side/webhook.

---

## Review

Fields:

- id
- buyerId
- manufacturerId
- orderId
- rating
- qualityRating
- deliveryRating
- comment
- createdAt

Later calculate a supplier trust score from real order performance.

---

## PackagingProduct

Future entity.

Examples:

- Jewellery box
- Jewellery pouch
- Shipping bag
- Thank-you card
- Sticker
- Product label
- Custom packaging

---

# 7. Core Business Workflow

The most important MVP workflow is:

```text
Buyer
  |
  | Posts Requirement
  v
Requirement / RFQ
  |
  v
Matching Manufacturers
  |
  v
Manufacturer Quotes
  |
  v
Buyer Compares Quotes
  |
  v
Accept Quote
  |
  v
Sample (optional)
  |
  v
Order
  |
  v
Payment
  |
  v
Production
  |
  v
Packaging
  |
  v
Shipping
  |
  v
Delivery
  |
  v
Review
```

Build and test this workflow before adding advanced features.

---

# 8. API Design

Use REST APIs.

Base URL:

```text
/api
```

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

## Manufacturers

```text
GET  /api/manufacturers
GET  /api/manufacturers/:id
PUT  /api/manufacturers/profile
POST /api/manufacturers/verification
GET  /api/manufacturers/verification-status
```

## Products

```text
POST   /api/products
GET    /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
```

## Requirements

```text
POST /api/requirements
GET  /api/requirements
GET  /api/requirements/:id
PUT  /api/requirements/:id
DELETE /api/requirements/:id
```

## Quotes

```text
POST /api/quotes
GET  /api/quotes
GET  /api/quotes/:id
PUT  /api/quotes/:id
```

## Samples

```text
POST /api/samples
GET  /api/samples
GET  /api/samples/:id
PUT  /api/samples/:id/status
```

## Orders

```text
POST /api/orders
GET  /api/orders
GET  /api/orders/:id
PUT  /api/orders/:id/status
```

## Payments

```text
POST /api/payments/create
POST /api/payments/webhook
GET  /api/payments/:id
```

## Reviews

```text
POST /api/reviews
GET  /api/manufacturers/:id/reviews
```

Admin APIs should be added later.

---

# 9. Search & Matching

The platform must support filtering by:

- Category
- Price
- MOQ
- Location
- Verified manufacturer
- Sample availability
- Customization availability
- Production time

Example:

```text
GET /api/products?
category=earrings
&maxPrice=60
&maxMoq=200
&location=Ahmedabad
&verified=true
```

## Future AI Matching

Later, support:

```text
Product image/design
        |
        v
AI analysis
        |
        v
Similar products
        |
        v
Suitable manufacturers
        |
        v
Quotes
```

Do not implement AI matching in the first backend version.

---

# 10. Security Requirements

Security must be considered from the beginning.

Implement:

- Password hashing
- JWT authentication
- Role-based authorization
- Zod input validation
- Rate limiting
- CORS configuration
- Helmet
- Environment variables
- Secure error responses
- Secure file-upload validation
- Payment webhook verification
- Request logging
- Database constraints
- Proper authorization checks on every protected resource

Never commit secrets to GitHub.

Use:

```text
.env
```

and provide:

```text
.env.example
```

---

# 11. Error Handling

Use a consistent API response structure.

Success:

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Product not found",
  "error": "PRODUCT_NOT_FOUND"
}
```

Use appropriate HTTP status codes:

```text
200 OK
201 CREATED
400 BAD_REQUEST
401 UNAUTHORIZED
403 FORBIDDEN
404 NOT_FOUND
409 CONFLICT
422 UNPROCESSABLE_ENTITY
500 INTERNAL_SERVER_ERROR
```

Do not expose database stack traces or sensitive information to clients.

---

# 12. Development Phases

## Phase 1 — Backend Foundation

Build only:

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma
- Environment configuration
- Folder structure
- Error handling
- Health-check endpoint
- Basic README

Health check:

```text
GET /api/health
```

Response:

```json
{
  "success": true,
  "message": "Backend is running"
}
```

---

## Phase 2 — Database + Authentication

Build:

- User model
- Buyer/manufacturer/admin roles
- Registration
- Login
- JWT
- Password hashing
- Auth middleware
- Role middleware
- Current-user endpoint

---

## Phase 3 — Manufacturer + Product

Build:

- Manufacturer profile
- Manufacturer verification
- Product CRUD
- Product images
- MOQ
- Product categories
- Sample availability
- Customization availability

---

## Phase 4 — Search

Build:

- Product search
- Manufacturer search
- Filters
- MOQ filtering
- Price filtering
- Location filtering
- Verification filtering

---

## Phase 5 — RFQ / Quote System

Build the core marketplace workflow:

```text
Buyer Requirement
→ Manufacturer Matching
→ Quote
→ Quote Comparison
→ Accept Quote
```

This phase is the highest-priority business feature.

---

## Phase 6 — Samples

Build:

```text
Request Sample
→ Accept
→ Ship
→ Deliver
→ Approve / Reject
```

---

## Phase 7 — Orders + Payments

Build:

```text
Accepted Quote
→ Order
→ Payment
→ Production
→ Shipping
```

Integrate Razorpay only after order logic works.

---

## Phase 8 — Trust & Reviews

Build:

- Reviews
- Ratings
- Quality rating
- Delivery rating
- Supplier performance
- Verification badge

---

## Phase 9 — Packaging

Build:

- Packaging suppliers
- Packaging products
- Custom packaging
- Business kit
- Packaging orders

---

## Phase 10 — Notifications & Admin

Build:

- Email notifications
- Admin dashboard APIs
- Manufacturer verification management
- Product moderation
- Order monitoring
- Reports

---

# 13. MVP Definition

The first usable backend MVP must support:

```text
User Registration
        ↓
Manufacturer Registration
        ↓
Manufacturer Verification
        ↓
Product Listing
        ↓
Buyer Searches Products
        ↓
Buyer Posts Requirement
        ↓
Manufacturer Sends Quote
        ↓
Buyer Accepts Quote
        ↓
Order Created
```

Do NOT consider the MVP complete until this flow works end-to-end.

---

# 14. Testing Strategy

Use automated tests progressively.

Test:

- Authentication
- Authorization
- Product CRUD
- Manufacturer verification
- Search/filtering
- Requirement creation
- Quote creation
- Quote acceptance
- Order creation
- Payment webhook
- Review creation

Important business rules must be tested.

Examples:

- A buyer cannot create a manufacturer product.
- A manufacturer cannot create a buyer requirement.
- A manufacturer cannot quote its own unauthorized requirement.
- A buyer cannot modify another buyer's requirement.
- Only verified manufacturers should receive the verified badge.
- A quote cannot be accepted twice.
- A review must be linked to a completed order.

---

# 15. API Documentation

Maintain API documentation while developing.

Use OpenAPI/Swagger after the core API structure is stable.

Document:

- Endpoint
- Method
- Authentication requirement
- Request body
- Parameters
- Response
- Error cases
- Required role

Do not wait until the entire backend is finished.

---

# 16. Git & Development Rules

Use Git from day one.

Recommended branches:

```text
main
develop
feature/auth
feature/products
feature/rfq
feature/orders
```

Commit examples:

```text
feat: initialize express backend
feat: add prisma database configuration
feat: add user authentication
feat: add manufacturer profile
feat: add product CRUD
feat: add RFQ workflow
fix: validate quote ownership
```

Never commit:

```text
.env
node_modules/
dist/
```

---

# 17. AI Coding Agent Rules

The AI coding agent must follow these rules:

1. Work only on the current development phase.
2. Do not implement future phases without explicit approval.
3. Do not replace the chosen technology stack without asking.
4. Do not introduce microservices.
5. Do not add unnecessary dependencies.
6. Do not modify the database schema without explaining the change.
7. Before changing existing APIs, check their current usage.
8. Maintain backward compatibility where practical.
9. Use TypeScript.
10. Validate all external input.
11. Keep business logic inside services.
12. Keep controllers focused on HTTP concerns.
13. Keep database access through Prisma.
14. Never expose secrets.
15. Write/update tests for important business logic.
16. Update documentation when architecture or APIs change.
17. If a requirement is ambiguous, stop and ask rather than inventing business rules.
18. Before finishing a task, run type checking, tests, and build where applicable.
19. Report exactly what was changed.
20. Do not claim a feature is complete if it has not been tested.

---

# 18. Development Workflow for Every Task

For every development request, follow:

```text
1. Understand requirement
        ↓
2. Check existing code
        ↓
3. Identify affected modules
        ↓
4. Explain implementation plan
        ↓
5. Implement
        ↓
6. Run type checking
        ↓
7. Run tests
        ↓
8. Run production build
        ↓
9. Fix errors
        ↓
10. Update documentation
        ↓
11. Report changes
```

Do not rewrite unrelated code.

---

# 19. Future Product Vision

After the MVP proves the marketplace model, the platform can expand into:

### Complete Business Kit

For example:

```text
200 Earrings
+
200 Jewellery Boxes
+
200 Pouches
+
200 Thank-you Cards
+
500 Logo Stickers
+
Shipping Bags
```

The buyer should eventually be able to manage the complete procurement process from one dashboard.

### Future AI Features

- Image-based product matching
- Manufacturer recommendation
- Smart quote comparison
- Supplier trust scoring
- Price estimation
- Demand prediction
- AI-assisted product specification

### Future Expansion

Start:

```text
Fashion Jewellery
```

Then potentially expand into:

```text
Fashion Accessories
→ Packaging
→ Gifts
→ Home Decor
→ Beauty
→ Other D2C categories
```

---

# 20. Definition of Success

The backend should ultimately make this process simple:

> A new entrepreneur has a product idea and needs 200 units.

Instead of searching multiple websites, calling manufacturers, finding packaging suppliers, arranging samples, and coordinating logistics separately, they should be able to use one platform to:

```text
Describe Product
      ↓
Find Verified Manufacturers
      ↓
Compare MOQ & Prices
      ↓
Request Sample
      ↓
Approve Sample
      ↓
Place Bulk Order
      ↓
Arrange Packaging
      ↓
Track Production
      ↓
Track Shipping
      ↓
Receive Ready-to-Sell Products
```

## Current instruction to AI agent

**START WITH PHASE 1 ONLY.**

Set up the backend foundation using:

**Node.js + TypeScript + Express + PostgreSQL + Prisma**

Create the project structure, configuration, database connection, error handling, health-check endpoint, environment setup, README, and development scripts.

Do not implement authentication, products, manufacturers, RFQs, orders, payments, frontend, AI, or any Phase 2+ functionality until explicitly instructed.
