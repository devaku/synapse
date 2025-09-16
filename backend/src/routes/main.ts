import express from 'express';

import { verifyJwt } from '../middlewares/auth-middleware';
import debugRouter from './debug';
import taskRouter from './tasks';

const apiRouter = express.Router();

apiRouter.use('/api/v1', taskRouter);
apiRouter.use('/api/v1', debugRouter);

export default apiRouter;
