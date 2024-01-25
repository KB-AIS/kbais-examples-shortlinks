import { Request, Response, Router } from 'express';
import { RequestWithSesion, sessionMiddleware } from '~sl-web/core/api';

const usersRounter = Router();

usersRounter.get('/integrations/telegram',
    sessionMiddleware.ensuereAuth ,
    // Workaround: Could not define typed route
    async (reqAny: any, res: Response) => {
        const req = reqAny as RequestWithSesion;
        // TODO: Request telegram integration link
        return res.send();
    }
);

export default usersRounter;
