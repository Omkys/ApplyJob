import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, validateEnv } from './config/env.js';
import routes from './routes/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

validateEnv();

const app = express();

const corsOptions = {
  origin: env.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// CORS must be registered before routes and other middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(requestLogger);
app.use(morgan(env.port === 5000 ? 'dev' : 'combined'));
app.use(express.json({ limit: '1mb' }));

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`ApplyFlow API → port ${env.port}`);
  console.log(`Health check  → /api/health`);
  console.log(`CORS origins  → ${env.corsOrigins.join(', ')}`);
});
