import { Request, Response } from 'express';
import * as taskService from '../services/tasks-service';
import { buildResponse, buildError } from '../lib/response-helper';

export async function createTask(req: Request, res: Response) {
	try {
		// TODO: Modify this endpoint to accept images

		let data = req.body;
		const task = await taskService.createTask(data);

		let finalResponse = buildResponse(
			200,
			'Data was created successfully!',
			task
		);

		res.status(200).json(finalResponse);
	} catch (error: any) {
		let finalResponse = buildError(500, 'There was an error', error);
		res.status(500).json(finalResponse);
	}
}

export async function readTask(req: Request, res: Response) {
	try {
		// TODO: Have a way to distinguish between reading one or many
		// Query string ek ek too.
		// Pagination maybe?

		const task = await taskService.readAllTask();
		let message = '';
		if (task.length > 0) {
			message = 'Data was retrieved successfully.';
		} else {
			message = 'Table is empty.';
		}

		let finalResponse = buildResponse(200, message, task);

		res.status(200).json(finalResponse);
	} catch (error) {
		let finalResponse = buildError(500, 'There was an error', error);
		res.status(500).json(finalResponse);
	}
}

export async function deleteTask(req: Request, res: Response) {
	try {
		console.log(req.body);
		const taskIdArray = req.body.taskIdArray;

		let deletedTasks = [];
		for (let x = 0; x < taskIdArray.length; x++) {
			const taskId = taskIdArray[x];
			const task = await taskService.deleteTask(taskId);
			deletedTasks.push(task);
		}

		let message = `${deletedTasks.length} row/s deleted successfully.`;

		let finalResponse = buildResponse(200, message, deletedTasks);

		res.status(200).json(finalResponse);
	} catch (error) {
		let finalResponse = buildError(500, 'There was an error', error);
		res.status(500).json(finalResponse);
	}
}
