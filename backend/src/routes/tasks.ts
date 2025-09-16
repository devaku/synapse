import express from 'express';
import {
	createTask,
	readTask,
	deleteTask,
} from '../controllers/tasks-controller';

const taskRouter = express.Router();

taskRouter.get('/tasks', readTask);
taskRouter.post('/tasks', express.json(), createTask);
taskRouter.delete('/tasks/:id', deleteTask);

export default taskRouter;
