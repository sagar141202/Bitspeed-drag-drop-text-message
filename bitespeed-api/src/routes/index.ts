import { Router } from 'express';
import { identifyHandler } from '../controllers/identifyController';

const router = Router();

/**
 * Routes for BiteSpeed API
 */

// POST /identify - Identity reconciliation endpoint
router.post('/identify', identifyHandler);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'BiteSpeed API is running' });
});

export default router;
