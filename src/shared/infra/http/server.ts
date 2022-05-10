import 'dotenv/config';
import 'express-async-errors';

import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';

import { logger } from '../utils/logger';
import { routes } from './routes';

const app = express();

Sentry.init({
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

app.use(express.json());
app.use(cors());
app.use(routes);

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());

app.get('/debug-sentry', (request, response) => {
  throw new Error('Sentry error!');
});

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    logger.error(err);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
      statusCode: 500,
    });
  }
);

app.listen(process.env.PORT, () => logger.info('Server is running'));
