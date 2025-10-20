import express from 'express';

import { verifyJwt } from '../middlewares/auth-middleware';
import debugRouter from './debug';
import taskRouter from './tasks';
import teamRouter from './teams';
import githubRouter from './github';
import userRouter from './users';
import commentRouter from './comments';
import notificationRouter from './notifications';
import deletionRequestRouter from './deletion_request';

const mainRouter = express.Router();

mainRouter.use('/api/v1/debug', debugRouter);
mainRouter.use(
	'/api/v1',

	// All routes are now protected
	verifyJwt,
	setupApiRoutes()
);

function setupApiRoutes(): express.Router {
	const apiRouter = express.Router();

	// API ROUTES
	apiRouter.use(taskRouter);
	apiRouter.use(teamRouter);
	apiRouter.use(commentRouter);
	apiRouter.use(githubRouter);
	apiRouter.use(userRouter);
	apiRouter.use(notificationRouter);
	apiRouter.use(deletionRequestRouter);

	return apiRouter;
}

export default mainRouter;
