import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Mount API Routes
app.use('/api', apiRoutes);

// Fallback Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

// Central Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Sigma Lending Server] Running in ${process.env.NODE_ENV || 'development'} on http://localhost:${PORT}`);
});

