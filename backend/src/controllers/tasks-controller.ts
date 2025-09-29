import { Request, Response } from 'express';
import * as taskService from '../services/task-service';
import { buildResponse, buildError } from '../lib/response-helper';

// CREATE - Create a new task
export async function createTask(req: Request, res: Response) {
	try {
		const data = req.body;

		// Validation: required fields
		if (!data || Object.keys(data).length === 0) {
			return res
				.status(400)
				.json(buildError(400, 'Request body cannot be empty', null));
		}
		if (!data.name || !data.description || !data.createdByUserId) {
			return res
				.status(400)
				.json(
					buildError(
						400,
						'Missing required fields: name, description, createdByUserId',
						null
					)
				);
		}

		// Used AI to set default priority of a task as 'Medium" | Prompt: "How do I set a task with a default priority state of Medium?"
		if (!data.priority) data.priority = 'MEDIUM';

		const task = await taskService.createTask(data);

		return res
			.status(201)
			.json(buildResponse(201, 'Task created successfully!', task));
	} catch (error: any) {
		console.error('CREATE TASK ERROR:', error);
		return res
			.status(500)
			.json(buildError(500, 'Error creating task', error));
	}
}

// READ - Get tasks
export async function readTask(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { userId } = req.query;

		let task;
		let message = '';

		if (id) {
			const taskId = parseInt(id);
			if (isNaN(taskId)) {
				return res
					.status(400)
					.json(buildError(400, 'Invalid task ID', null));
			}

			task = await taskService.readTaskById(taskId);
			if (!task)
				return res
					.status(404)
					.json(buildError(404, 'Task not found', null));

			message = 'Task retrieved successfully.';
		} else if (userId) {
			const userIdNumber = parseInt(userId as string);
			if (isNaN(userIdNumber))
				return res
					.status(400)
					.json(buildError(400, 'Invalid userId parameter', null));

			task = await taskService.readTasksFilteredForUser(userIdNumber);
			message =
				task.length > 0
					? 'User tasks retrieved successfully.'
					: 'No tasks found for this user.';
		} else {
			task = await taskService.readAllTask();
			message =
				task.length > 0
					? 'Tasks retrieved successfully.'
					: 'No tasks found.';
		}

		return res.status(200).json(buildResponse(200, message, task));
	} catch (error: any) {
		console.error('READ TASK ERROR:', error);
		return res
			.status(500)
			.json(buildError(500, 'Error retrieving tasks', error));
	}
}

// UPDATE - Update an existing task
export async function updateTask(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const data = req.body;

		if (!id)
			return res
				.status(400)
				.json(buildError(400, 'Task ID is required', null));
		const taskId = parseInt(id);
		if (isNaN(taskId))
			return res
				.status(400)
				.json(buildError(400, 'Invalid task ID', null));
		if (!data || Object.keys(data).length === 0)
			return res
				.status(400)
				.json(buildError(400, 'Request body cannot be empty', null));

		const existingTask = await taskService.readTaskById(taskId);
		if (!existingTask)
			return res
				.status(404)
				.json(buildError(404, 'Task not found', null));

		const updatedTask = await taskService.updateTask(taskId, data);
		return res
			.status(200)
			.json(
				buildResponse(200, 'Task updated successfully!', updatedTask)
			);
	} catch (error: any) {
		console.error('UPDATE TASK ERROR:', error);
		return res
			.status(500)
			.json(buildError(500, 'Error updating task', error));
	}
}

// DELETE - Delete tasks (single or multiple)
export async function deleteTask(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const taskIdArray = req.body?.taskIdArray; // safe even if body is undefined

		const deletedTasks = [];
		let message = '';

		if (id) {
			// Delete single task
			const taskId = parseInt(id);
			if (isNaN(taskId))
				return res
					.status(400)
					.json(buildError(400, 'Invalid task ID', null));

			const deletedTask = await taskService.deleteTask(taskId);
			deletedTasks.push(deletedTask);
			message = 'Task deleted successfully.';
		} else if (
			taskIdArray &&
			Array.isArray(taskIdArray) &&
			taskIdArray.length > 0
		) {
			// Delete multiple tasks
			for (const taskIdString of taskIdArray) {
				const taskId = parseInt(taskIdString);
				if (!isNaN(taskId)) {
					const task = await taskService.deleteTask(taskId);
					if (task) deletedTasks.push(task);
				}
			}

			if (deletedTasks.length === 0) {
				return res
					.status(400)
					.json(
						buildError(
							400,
							'No tasks were deleted. Check if task IDs are valid.',
							null
						)
					);
			}

			message = `${deletedTasks.length} task(s) deleted successfully.`;
		} else {
			return res
				.status(400)
				.json(
					buildError(
						400,
						'Provide task ID in URL or taskIdArray in body',
						null
					)
				);
		}

		return res.status(200).json(buildResponse(200, message, deletedTasks));
	} catch (error: any) {
		console.error('DELETE TASK ERROR:', error);
		return res
			.status(500)
			.json(buildError(500, 'Error deleting task(s)', error));
	}
}
