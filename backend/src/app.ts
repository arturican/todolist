import cors from 'cors';
import express, { type Request as ExpressRequest } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, frontendOrigins } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { notFoundHandler } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestIdMiddleware } from './middleware/request-id.js';

export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', env.TRUST_PROXY);
  morgan.token('request-id', req => {
    return (req as ExpressRequest).requestId ?? 'n/a';
  });

  app.use(requestIdMiddleware);
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || frontendOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(null, false);
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      optionsSuccessStatus: 204,
    }),
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        message: 'Too many requests. Please try again later.',
      },
    }),
  );

  app.use(
    express.json({
      limit: env.REQUEST_BODY_LIMIT,
      strict: true,
    }),
  );

  if (env.NODE_ENV !== 'test') {
    app.use(
      morgan(':method :url :status :response-time ms req_id=:request-id'),
    );
  }

  app.get('/', (_req, res) => {
    res.status(200).json({ message: 'Todolist backend is running' });
  });

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api', apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export const app = createApp();
