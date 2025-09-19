import express, { NextFunction, Request, Response } from 'express';

import { verifyJwt } from '../middlewares/auth-middleware';
import debugRouter from './debug';
import taskRouter from './tasks';

const mainRouter = express.Router();

mainRouter.use(
	'/api/v1',

	// All routes are now protected
	// verifyJwt,
	setupApiRoutes()
);

function setupApiRoutes(): express.Router {
	const apiRouter = express.Router();

	// API ROUTES
	apiRouter.use(taskRouter);
	apiRouter.use(debugRouter);

	return apiRouter;
}

export default mainRouter;
