import { Router } from 'express'
import authRouter from '@/modules/auth/api/v1/auth.router';

const v1Router = Router();

v1Router.use("/auth", authRouter);

export default v1Router;