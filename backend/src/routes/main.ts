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
import aiRouter from './ai-routes';
import cors from 'cors';
import { corsValues } from '../lib/cors';
import path from 'path';

const mainRouter = express.Router();

mainRouter.use('/api/v1/debug', debugRouter);
mainRouter.use(
	'/api/v1',

	// All routes are now protected
	// Load CORS
	cors({
		// origin: '*',
		origin: corsValues,
		credentials: true,
	}),
	verifyJwt,
	setupApiRoutes()
);

mainRouter.use((req, res) => {
	res.sendFile(path.join(ROOT_DIR, 'public/index.html'));
});

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
	apiRouter.use('/ai', aiRouter);

	return apiRouter;
}

export default mainRouter;
