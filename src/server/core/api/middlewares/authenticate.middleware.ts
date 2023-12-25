import { NextFunction, Request, Response } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        req.headers.authorization.split(' ');
    }
};