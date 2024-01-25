import { Request, Response, Router } from 'express';
import { NanoidLinkGenerator } from '~sl-modules/links/services/link.geneartor';
import { StatusCodes, sessionMiddleware } from '~sl-web/core/api';

const linksRounter = Router();

linksRounter.post('/',
    sessionMiddleware.ensureSignedUp,
    async (req: Request, res: Response) => {
        const link = new NanoidLinkGenerator().get();

        return res.status(StatusCodes.OK).json({ link: link })
    }
);

export default linksRounter;
