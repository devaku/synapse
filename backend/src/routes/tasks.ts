import express from 'express';
import { createTask } from '../controllers/tasks-controller';

const taskRouter = express.Router();

taskRouter.post('/task', express.json(), (req, res) => createTask(req, res));

export default taskRouter;
