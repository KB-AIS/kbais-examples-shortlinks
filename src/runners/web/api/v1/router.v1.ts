import { Router } from 'express';
import authRouter from './router.v1.auth';
import linksRounter from './router.v1.links';
import usersRounter from './router.v1.users';

const v1Router = Router()
    .use('/auth', authRouter)
    .use('/users', usersRounter)
    .use('/links', linksRounter);

export { v1Router };