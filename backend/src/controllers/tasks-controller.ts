import { Request, Response } from 'express';
import * as taskService from '../services/tasks-service';

export async function createTask(req: Request, res: Response) {
	try {
		// TODO: Modify this endpoint to accept images

		let data = req.body;
		const task = await taskService.createTask(data);

		// TODO: Standardize API responses
		res.json({
			statusText: 'success',
			data: [
				{
					...task,
				},
			],
		});
	} catch (error) {
		console.log(error);
	}
}

export async function readTask(req: Request, res: Response) {
	try {
		// TODO: Have a way to distinguish between reading one or many
		// Query string ek ek too.
		// Pagination maybe?

		const task = await taskService.readAllTask();

		// TODO: Standardize API responses
		res.json({
			statusText: 'success',
			data: task,
		});
	} catch (error) {
		console.log(error);
	}
}
