import express from 'express';
import {
	createTask,
	readTask,
	updateTask,
	deleteTask,
} from '../controllers/tasks-controller';

const taskRouter = express.Router();

// CREATE
taskRouter.post('/tasks', express.json(), createTask);

// READ all or one
//  - GET /tasks        → all tasks
//  - GET /tasks/:id    → single task
//  - GET /tasks?useronly=1 (boolean) → tasks for user
taskRouter.get('/tasks', readTask);
taskRouter.get('/tasks/:id', readTask);

// UPDATE
taskRouter.put('/tasks/:id', express.json(), updateTask);

// DELETE
//  - DELETE /tasks/:id → delete one
//  - DELETE /tasks     → delete multiple via { "taskIdArray": [1,2,3] }
taskRouter.delete('/tasks/:id', deleteTask);
taskRouter.delete('/tasks', express.json(), deleteTask);

export default taskRouter;
