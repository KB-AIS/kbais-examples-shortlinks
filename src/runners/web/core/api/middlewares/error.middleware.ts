import { NextFunction, Request, Response } from 'express';
import { logger } from '~sl-core/utils/index';
import { StatusCodes } from '../api.consts';

export const error = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err, 'Unhandled error has been caught');

    res.status(StatusCodes.INTERNAL).send({ error: 'Internal server error' });
};