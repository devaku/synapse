import express from 'express';
import { createTask, readTask } from '../controllers/tasks-controller';

const taskRouter = express.Router();

taskRouter.get('/tasks', express.json(), readTask);
taskRouter.post('/tasks', express.json(), createTask);

export default taskRouter;
