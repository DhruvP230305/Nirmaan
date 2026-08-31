# D2C Sourcing & Manufacturing Platform — Backend

This is the backend for the B2B sourcing and manufacturing platform built with Node.js, TypeScript, Express, PostgreSQL, and Prisma ORM.

## Technologies

* **Node.js**: Server-side runtime.
* **TypeScript**: Static typing for Javascript.
* **Express**: Web framework for routing and middleware.
* **Prisma ORM**: Type-safe database client and migrations.
* **PostgreSQL**: Relational database storage.
* **Zod**: Runtime schema validation.
* **Helmet & CORS**: Basic HTTP headers and cross-origin security.

---

## Getting Started

### 1. Prerequisites

Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* [PostgreSQL](https://www.postgresql.org/) (running locally or a cloud database instance on Supabase/Neon)

### 2. Installation

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### 3. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and set your database connection details:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/d2c_sourcing?schema=public"
   ```

### 4. Database Setup

Once your `DATABASE_URL` is set up, run the Prisma commands to generate the database client and push the schema:

```bash
# Generate the Prisma Client
npm run prisma:generate

# Sync schema with database (running migrations/pushing changes)
npx prisma db push
```

### 5. Running the Application

* **Development mode** (with hot-reloading using `tsx`):
  ```bash
  npm run dev
  ```

* **Production Build**:
  ```bash
  npm run build
  ```

* **Start Production Server**:
  ```bash
  npm run start
  ```

---

## Project Structure

```text
backend/
├── prisma/
│   └── schema.prisma         # Prisma database schema configuration
├── src/
│   ├── config/
│   │   ├── database.ts       # Prisma client initialization
│   │   └── env.ts            # Zod environment variable validator
│   ├── middleware/
│   │   └── error.middleware.ts # Global express error handler
│   ├── utils/
│   │   ├── api-response.ts   # Standard success/error responses
│   │   └── logger.ts         # Console logger utility
│   ├── app.ts                # Express application setup
│   └── server.ts             # Application entrypoint
├── .env.example              # Env template
├── package.json              # Project script & dependency manager
├── tsconfig.json             # TypeScript compiler rules
└── README.md                 # Project documentation
```

---

## API Endpoints

### Health Check

* **URL**: `/api/health`
* **Method**: `GET`
* **Response**:
  ```json
  {
    "success": true,
    "message": "Backend is running"
  }
  ```
