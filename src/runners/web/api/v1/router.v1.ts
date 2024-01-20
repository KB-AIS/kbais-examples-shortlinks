import { Router } from 'express';
import authRouter from './router.v1.auth';
import linksRounter from './router.v1.links';

const v1Router = Router()
    .use("/auth", authRouter)
    .use('/links', linksRounter);

export { v1Router };