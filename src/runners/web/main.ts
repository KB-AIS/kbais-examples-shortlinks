import v1Router from '@/configuration/api/v1/api.v1.router';
import { configureMongo } from '@/configuration/persistence/configuration.mongo';
import logger from '@/core/services/core.logger.pino';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json } from 'express';
import helmet from 'helmet';
import pinoHttp, { Options as LoggerOptions } from 'pino-http';
import ViteExpress from 'vite-express';

const loggerOptions: LoggerOptions = {
    logger: logger,
    useLevel: 'trace',
};

const corsOptions = { credentials: true, origin: 'http://localhost:4000' };

const app = express();

app.use(pinoHttp(loggerOptions))
app.use(json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());

app.use('/api/v1', v1Router);

const SERVICE_PORT_DEFAULT = 5000;

const servicePort = process.env.SL_SERVICE__PORT || SERVICE_PORT_DEFAULT;

ViteExpress.listen(app, 3000, async () => {
    await configureMongo();

    logger.info('Example app listening on port %d', servicePort);
});

process.on('SIGINT', () => {
    logger.info('App is shutting down');

    process.exit(0);
});