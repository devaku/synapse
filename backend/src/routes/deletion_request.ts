import express from 'express';
import { createDeletionRequest } from '../controllers/deletion-requests-controller';

const deletionRequestRouter = express.Router();

// CREATE
deletionRequestRouter.post(
	'/deletion-request',
	express.json(),
	createDeletionRequest
);

export default deletionRequestRouter;
