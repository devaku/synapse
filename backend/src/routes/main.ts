import express from 'express';

import { Request, Response } from 'express';
import debugRouter from './debug';
import taskRouter from './tasks';

const apiRouter = express.Router();

apiRouter.use('/api/v1', taskRouter);
apiRouter.use('/api/v1', debugRouter);

export default apiRouter;
