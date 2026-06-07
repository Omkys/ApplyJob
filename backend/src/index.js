import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, validateEnv } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

validateEnv();

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(
  cors({
    origin: [env.frontendUrl, 'http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`ApplyFlow API → http://localhost:${env.port}`);
  console.log(`Health check  → http://localhost:${env.port}/api/health`);
});
