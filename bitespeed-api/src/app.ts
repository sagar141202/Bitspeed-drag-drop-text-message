import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';

/**
 * Express Application Setup
 * 
 * Creates and configures the Express application with:
 * - CORS for cross-origin requests
 * - JSON body parsing
 * - API routes
 * - Error handling
 */

const app: Application = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to BiteSpeed Identity Reconciliation API',
    version: '1.0.0',
    endpoints: {
      identify: 'POST /api/identify',
      health: 'GET /api/health'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

export default app;
