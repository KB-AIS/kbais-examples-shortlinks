import { NextFunction, Request, Response } from 'express';
import { ISessionAccessTokenIssuer, SessionPayload } from '~sl-modules/auth/services/session.accesstoken.issuer';
import { StatusCodes } from '../api.consts';
import { accessTokenIssuer } from '~sl-modules/auth';
import { matchI } from 'ts-adt';
import { UserKind } from '~sl-modules/users';

export interface RequestWithSesion extends Request {
    session: SessionPayload | undefined;
}

export class SessionMiddleware {
    constructor(
        private accessTokenIssuer: ISessionAccessTokenIssuer
    ) { }

    ensuereAuth = async (req: Request, res: Response, next: NextFunction) => {
        const accessTokenHeader = req.headers['authorization'];

        if (!accessTokenHeader) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .send({ message: 'No access token provided' });
        }

        const accessTokenHeaderParts = accessTokenHeader.split(' ');

        if (accessTokenHeaderParts.length !== 2 || accessTokenHeaderParts[0] !== 'Bearer') {
            return res
                .status(StatusCodes.FORBIDDEN)
                .send({ message: 'Wrong authorization header format' });
        }

        const accessToken = accessTokenHeaderParts[1];

        return matchI(await this.accessTokenIssuer.decode(accessToken))({
            success: ({ value }) => {
                (req as RequestWithSesion).session = value;

                return next();
            },
            failure: ({ }) => res
                .status(StatusCodes.FORBIDDEN)
                .send({ message: 'Token signature expired' })
        });
    };

    ensureSignedUp = async (req: Request, res: Response, next: NextFunction) => {
        return this.ensuereAuth(req, res, () => {
            const reqWithSession = req as RequestWithSesion;

            if (reqWithSession.session?.userkind !== UserKind.SIGNED) {
                return res
                    .status(StatusCodes.FORBIDDEN)
                    .send({ message: 'Must be signed up to continue' });
            }

            return next();
        });
    }
}

export const sessionMiddleware = new SessionMiddleware(accessTokenIssuer);
