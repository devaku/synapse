import express, { Request, Response, NextFunction } from 'express';

import { readAllUsers } from '../controllers/users-controller';

const userRouter = express.Router();

// Read all users
userRouter.get('/users', readAllUsers);

export default userRouter;
