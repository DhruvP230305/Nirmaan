import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errorMiddleware } from './middleware/error.middleware.js';
import { successResponse } from './utils/api-response.js';

import authRoutes from './routes/auth.routes.js';
import manufacturerRoutes from './routes/manufacturer.routes.js';
import productRoutes from './routes/product.routes.js';
import rfqRoutes from './routes/rfq.routes.js';
import sampleRoutes from './routes/sample.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import reviewRoutes from './routes/review.routes.js';
import packagingRoutes from './routes/packaging.routes.js';
import adminRoutes from './routes/admin.routes.js';
import messageRoutes from './routes/message.routes.js';

const app: Express = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json(successResponse('Backend is running'));
});

// API Routes for All 13 Phases
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/manufacturers', manufacturerRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/rfqs', rfqRoutes);
app.use('/api/v1/samples', sampleRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/packaging', packagingRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/messages', messageRoutes);

// 404 Route Not Found Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
    error: 'NOT_FOUND',
  });
});

// Global Error Handler
app.use(errorMiddleware);

export default app;
