import express, { Request, Response, NextFunction } from 'express';
import { uploadMiddleware } from '../middlewares/upload-middleware';

import { createComment } from '../controllers/comments-controller';

const commentRouter = express.Router();

/**
 * HARD ROUTES
 */

// CREATE
commentRouter.post(
	'/comments',
	uploadMiddleware.array('pictures'),
	createComment
);

export default commentRouter;
