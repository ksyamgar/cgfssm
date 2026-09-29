import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db.js';
import { seedDatabase } from './seed.js';
import { startAutomation } from './automation.js';
import authRoutes from './routes/auth.js';
import fsmRoutes from './routes/fsm.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/fsm', fsmRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    engine: 'SQLite (WAL Mode + Foreign Keys)',
    auth: 'JWT (jsonwebtoken) + bcryptjs',
    timestamp: new Date().toISOString()
  });
});

// Startup Sequence
const startServer = async () => {
  try {
    await initDatabase();
    await seedDatabase();
    startAutomation();

    app.listen(PORT, () => {
      console.log(`🚀 CG Rural FSSM Backend Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Fatal Server Startup Error:', err);
    process.exit(1);
  }
};

startServer();
