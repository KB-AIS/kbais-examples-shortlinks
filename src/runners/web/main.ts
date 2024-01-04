import 'express-async-errors';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import express, { json } from 'express';
import gracefulShutdown from 'http-graceful-shutdown';
import helmet from 'helmet';
import pinoHttp, { Options as LoggerOptions } from 'pino-http';
import ViteExpress from 'vite-express';
import { configureMongo } from '~sl-core/persistence/configuration.mongo';
import { logger } from '~sl-core/utils';
import v1Router from './api/v1';
import { error } from './core/api/middlewares/error.middleware';

const loggerOptions: LoggerOptions = {
    logger: logger,
    useLevel: 'trace'
};

const APP_ORIGIN_URL_DEFAULT = 'http://localhost:5000'

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

app.use(error);

const SERVICE_PORT_DEFAULT = 5000;

const servicePort = parseInt(process.env.SL_SERVICE__PORT ?? '') || SERVICE_PORT_DEFAULT;

const onStartup = async () => {
    await configureMongo();

    logger.info('App listening on port %d', servicePort);
};

const onShutdown = async (_signal?: string) => {
    logger.info('App has been shutdown');
};

const server = ViteExpress.listen(app, servicePort, onStartup);

gracefulShutdown(server, {
    signals: 'SIGINT SIGTERM',
    timeout: 3000,
    development: false,
    forceExit: true,
    onShutdown: onShutdown
});