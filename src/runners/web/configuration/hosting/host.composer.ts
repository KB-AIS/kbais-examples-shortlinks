import 'express-async-errors';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json } from 'express';
import actuator from 'express-actuator';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { logger } from '~sl-core/utils';
import v1Router from '../../api/v1/index';
import { error } from '../../core/api/middlewares/error.middleware';

const hostComposer = express();

hostComposer.use(pinoHttp({
    logger: logger,
}));

hostComposer.use(json());

hostComposer.use(cookieParser());

const APP_ORIGIN_URL_DEFAULT = 'http://localhost:5000'

hostComposer.use(cors({
    credentials: true,
    origin: process.env.SL_SERVICE__APP_ORIGIN_URL || APP_ORIGIN_URL_DEFAULT
}));

hostComposer.use(helmet());

hostComposer.use(actuator());

hostComposer.use('/api/v1', v1Router);

hostComposer.use("/:link", (req, res) => {
    // TODO: Add skip-middleware page option
    res.redirect('https://google.com');
});

hostComposer.use(error);

export default hostComposer;
