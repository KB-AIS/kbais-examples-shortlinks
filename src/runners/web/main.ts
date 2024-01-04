import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import express, { json, NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import pinoHttp, { Options as LoggerOptions } from 'pino-http';
import ViteExpress from 'vite-express';
import { configureMongo as setupMongo } from '~sl-core/persistence/configuration.mongo';
import { logger } from '~sl-core/utils';
import v1Router from './api/v1';

const loggerOptions: LoggerOptions = {
    logger: logger,
    useLevel: 'trace'
};

const APP_ORIGIN_URL_DEFAULT = 'http://localhost:4000'

const corsOptions: CorsOptions = {
    credentials: true,
    origin: process.env.SL_SERVICE__APP_ORIGIN_URL || APP_ORIGIN_URL_DEFAULT
};

const app = express();

app.use(pinoHttp(loggerOptions));
app.use(json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());

app.use('/api/v1', v1Router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err, 'Unhandled error has been caught');

    next(err);
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send({ error: 'Internal server error' });
});

const SERVICE_PORT_DEFAULT = 5000;

const servicePort = parseInt(process.env.SL_SERVICE__PORT ?? '') || SERVICE_PORT_DEFAULT;

ViteExpress.listen(app, servicePort, async () => {
    await setupMongo();

    logger.info('Example app listening on port %d', servicePort);
});

process.on('SIGINT', () => {
    logger.info('App is shutting down');

    process.exit(0);
});