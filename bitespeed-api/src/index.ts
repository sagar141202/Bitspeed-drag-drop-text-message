import app from './app';

const PORT = process.env.PORT || 3000;

/**
 * BiteSpeed API Server Entry Point
 * 
 * Starts the Express server and listens on the specified port.
 */

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   BiteSpeed Identity Reconciliation API                  ║
║   Server running on port ${PORT}                             ║
║                                                           ║
║   Endpoints:                                              ║
║   - POST /api/identify  - Identity reconciliation         ║
║   - GET  /api/health   - Health check                     ║
║   - GET  /            - API info                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
