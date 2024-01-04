import { Router } from 'express';
import authRouter from './router.v1.auth';

const v1Router = Router();

v1Router.use("/auth", authRouter);

export { v1Router };