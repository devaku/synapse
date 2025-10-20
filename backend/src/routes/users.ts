import express, { Request, Response, NextFunction } from 'express';

import {
	readAllUsers,
	readUserByKeycloakId,
} from '../controllers/users-controller';

const userRouter = express.Router();

// Read all users
userRouter.get('/users', readAllUsers);
userRouter.get('/users/:id', readUserByKeycloakId);

export default userRouter;
