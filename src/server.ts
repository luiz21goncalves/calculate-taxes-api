import 'dotenv/config';

import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

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

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    console.log(err);

    return response.status(500).json({
      status: 'error',
      message: `Internal server error`,
      statusCode: 500,
    });
  }
);

app.listen(3333, () => console.log('Server is running'));
