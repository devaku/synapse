import express, { Request, Response, NextFunction } from 'express';
import {
	createTask,
	readTask,
	updateTask,
	deleteTask,
	readSubscribedTasks,
} from '../controllers/tasks-controller';
import {
	subscribe,
	unsubscribe,
} from '../controllers/task-subscriptions-controller';
import { uploadMiddleware } from '../middlewares/upload-middleware';

const taskRouter = express.Router();

/**
 * HARD ROUTES
 */

// CREATE
taskRouter.post('/tasks', uploadMiddleware.array('pictures'), createTask);

// READ all or one
//  - GET /tasks        → all tasks
//  - GET /tasks?useronly=1 (boolean) → tasks only visible to that user
taskRouter.get('/tasks', readTask);

// Get all tasks the user is SUBSCRIBED too
taskRouter.get('/tasks/subscribed', readSubscribedTasks);

taskRouter.delete('/tasks', express.json(), deleteTask);

/**
 * ROUTES WITH PARAMS
 */

// Archive a task
taskRouter.put(
	'/tasks/archive/:id',
	express.json(),
	(req: Request, res: Response, next: NextFunction) => {
		// Just attach the user id of who is archiving it. lol
		req.body.archivedByUserId = req.session.userData?.user.id;
		next();
	},
	updateTask
);

// Routes that have route parameters need to be further down
//  - GET /tasks/:id    → single task
taskRouter.get('/tasks/:id', readTask);

// UPDATE
taskRouter.put('/tasks/:id', express.json(), updateTask);

// DELETE
//  - DELETE /tasks/:id → delete one
//  - DELETE /tasks     → delete multiple via { "taskIdArray": [1,2,3] }
taskRouter.delete('/tasks/:id', deleteTask);

// SUBSCRIPTION routes
taskRouter.post('/tasks/:id/subscribe', express.json(), subscribe);
taskRouter.delete('/tasks/:id/unsubscribe', express.json(), unsubscribe);

export default taskRouter;
