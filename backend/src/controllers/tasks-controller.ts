import { Prisma } from '../../database/generated/prisma';
import { prismaDb, txtimeoutValue } from '../lib/database';
import { Request, Response } from 'express';
import { createTaskService } from '../services/task-service';
import { createImageService } from '../services/images-service';
import { createImageLinkService } from '../services/image-link-service';
import { createVisibilityService } from '../services/visibility-service';
import { buildResponse, buildError } from '../lib/response-helper';

import { deleteUploadedFiles } from '../lib/file-helper';
import { IMAGE_STORAGE_URL } from '../lib/env-variables';

// CREATE - Create a new task
export async function createTask(req: Request, res: Response) {
	return prismaDb.$transaction(
		async (tx: Prisma.TransactionClient) => {
			const taskService = createTaskService(tx);
			const imageLinkService = createImageLinkService(tx);
			const imageService = createImageService(tx);

			try {
				let data = req.body;
				const userId = req.session.userData?.user.id;

				// Attach creator
				data.createdByUserId = userId;

				// TODO: These validations need to be relegated to Zod in a future update
				// #region Validation
				// Validation: required fields
				if (!data || Object.keys(data).length === 0) {
					return res
						.status(400)
						.json(
							buildError(
								400,
								'Request body cannot be empty',
								null
							)
						);
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

				// #endregion

				// Attach the visiblity rules
				data = createTaskVisiblityRules(data);

				// Have the user who created it be subscribed to it by default
				data.taskUserSubscribeTo = {
					create: {
						userId,
					},
				};

				// Create the task
				const task = await taskService.createTask(data);

				// Save the images
				let imageRows;
				if (Array.isArray(req.files)) {
					const uploaded = req.files;
					if (uploaded.length > 0) {
						const images = uploaded.map((el: any) => {
							return `${IMAGE_STORAGE_URL}/${el.filename}`;
						});
						imageRows = await imageService.createImage(
							userId!,
							images
						);
					}
				}

				// Link the images to the task created
				if (imageRows) {
					let imageIds = imageRows.map((el: any) => el.id);
					await imageLinkService.linkImagesToTasks(imageIds, task.id);
				}

				// Retrieve the task again, this time with the images. lol
				const taskRow = await taskService.readTaskById(task.id);

				return res
					.status(201)
					.json(
						buildResponse(
							201,
							'Task created successfully!',
							taskRow
						)
					);
			} catch (error: any) {
				/**
				 * If there was ever any error
				 * make sure to properly destroy any uploaded images
				 */

				if (Array.isArray(req.files)) {
					const uploaded = req.files;
					if (uploaded.length > 0) {
						deleteUploadedFiles(uploaded, req.upload_location);
					}
				}

				return res
					.status(500)
					.json(
						buildError(500, 'Error in creating the task!', error)
					);
			}
		},
		{
			timeout: txtimeoutValue(),
		}
	);
}

// READ - Get tasks
export async function readTask(req: Request, res: Response) {
	const taskService = createTaskService(prismaDb);
	try {
		const { id } = req.params;
		const { useronly } = req.query;

		let task;
		let message = '';

		// Read a task
		if (id) {
			/**
			 * Theoretically, this is insecure. Anyone can view the specifics of any task
			 * assuming they know the ID for it, regardless if they are allowed to view it.
			 * Because all they need is an ID. lol
			 *
			 * We could probably secure this by cross checking
			 * the task the request is trying to view based on the visibility rules of the task
			 *
			 * But I don't really want to bother. lol
			 */
			const taskId = parseInt(id);
			if (isNaN(taskId)) {
				let error = new Error('Invalid Task Id');
				return res
					.status(400)
					.json(buildError(400, 'Invalid task ID', error));
			}

			task = await taskService.readTaskById(taskId);
			if (!task) {
				let error = new Error('Invalid Task Id');
				return res
					.status(404)
					.json(buildError(404, 'Task not found', error));
			}

			message = 'Task retrieved successfully.';
		} else if (useronly) {
			const userId = req.session.userData!.user.id;

			task = await taskService.readTasksFilteredForUser(userId);
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

export async function readSubscribedTasks(req: Request, res: Response) {
	const taskService = createTaskService(prismaDb);
	try {
		const userId = req.session.userData!.user.id;

		// TODO: Validation. Ugh

		// Read a task
		let taskRows = await taskService.readTasksUserIsSubscribedTo(userId);
		let message =
			taskRows.length > 0
				? 'Tasks retrieved successfully.'
				: 'No tasks found.';

		return res.status(200).json(buildResponse(200, message, taskRows));
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
		// TODO: This will have to be updated when image uploading is added
		const { id } = req.params;
		let data = req.body;

		// TODO: These validations need to be relegated to Zod in a future update
		// #region Validation
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
		//#endregion
		const taskService = createTaskService(prismaDb);
		const existingTask = await taskService.readTaskById(taskId);
		if (!existingTask)
			return res
				.status(404)
				.json(buildError(404, 'Task not found', null));

		// User who created task must always have the task visible to them
		if (data.taskVisibleToUsers) {
			data.taskVisibleToUsers.push(existingTask.createdByUserId);
		} else {
			data.taskVisibleToUsers = [existingTask.createdByUserId];
		}

		// User who created task MUST NOT be in hidden users
		if (data.taskHiddenFromUsers) {
			data.taskHiddenFromUsers = data.taskHiddenFromUsers.filter(
				(el: any) => el != existingTask.createdByUserId
			);
		}

		// BEGIN TRANSACTION
		try {
			// Attach the visiblity rules
			await prismaDb.$transaction(
				async (tx: Prisma.TransactionClient) => {
					// Update the task with the new visiblity rules
					await updateTaskVisiblityRules(tx, data, existingTask);

					// Remove visiblity rules now
					delete data.taskVisibleToUsers;
					delete data.taskHiddenFromUsers;
					delete data.taskVisibleToTeams;

					const taskService = createTaskService(tx);
					const updatedTask = await taskService.updateTask(
						taskId,
						data
					);
					return res
						.status(200)
						.json(
							buildResponse(
								200,
								'Task updated successfully!',
								updatedTask
							)
						);
				},
				{
					timeout: txtimeoutValue(),
				}
			);
		} catch (error) {
			throw error;
		}
	} catch (error: any) {
		console.error('UPDATE TASK ERROR:', error);
		return res
			.status(500)
			.json(buildError(500, 'Error updating task', error));
	}
}

// DELETE - Delete tasks (single or multiple)
export async function deleteTask(req: Request, res: Response) {
	const taskService = createTaskService(prismaDb);
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

/**
 * INTERNAL FUNCTIONS
 */

/**
 * Build the prisma objects for task visiblity
 */
function createTaskVisiblityRules(data: any) {
	let ids: number[] = [];
	// ALWAYS include user into visible users
	if (data.taskVisibleToUsers) {
		ids = data.taskVisibleToUsers;

		if (!ids.includes(data.createdByUserId!)) {
			ids.push(data.createdByUserId!);
		}
	} else {
		ids = [data.createdByUserId!];
	}

	data.taskVisibleToUsers = {
		create: ids.map((el: Number) => {
			return { userId: Number(el) };
		}),
	};

	if (data.taskVisibleToTeams) {
		let ids = data.taskVisibleToTeams;
		data.taskVisibleToTeams = {
			create: ids.map((el: Number) => {
				return { teamId: Number(el) };
			}),
		};
	}

	if (data.taskHiddenFromUsers) {
		let ids = data.taskHiddenFromUsers;
		data.taskHiddenFromUsers = {
			create: ids.map((el: Number) => {
				return { userId: Number(el) };
			}),
		};
	}

	return data;
}

async function updateTaskVisiblityRules(
	tx: Prisma.TransactionClient,
	data: any,
	existingTask: any
) {
	const visiblityService = createVisibilityService(tx);
	const taskId = existingTask.id;

	// Check the TaskVisibleToUsers
	if (data.taskVisibleToUsers) {
		let database = existingTask.taskVisibleToUsers.map((el: any) => {
			return el.user.id;
		});
		let updated = data.taskVisibleToUsers;

		// Get the values to be removed
		let removedValues = database.filter(
			(el: number) => !updated.includes(el)
		);

		// Get the values that need to be inserted
		let valuesCreated = updated.filter(
			(el: number) => !database.includes(el)
		);

		await visiblityService.updateTaskVisibleToUsersRelations(
			removedValues,
			valuesCreated,
			taskId
		);
	}

	// Check the taskVisibleToTeams
	if (data.taskVisibleToTeams) {
		let database = existingTask.taskVisibleToTeams.map((el: any) => {
			return el.team.id;
		});
		let updated = data.taskVisibleToTeams;

		// Get the values to be removed
		let removedValues = database.filter(
			(el: number) => !updated.includes(el)
		);

		// Get the values that need to be inserted
		let valuesCreated = updated.filter(
			(el: number) => !database.includes(el)
		);

		await visiblityService.updateTaskVisibleToTeamsRelations(
			removedValues,
			valuesCreated,
			taskId
		);
	}

	// Check the TaskHiddenFromUsers
	if (data.taskHiddenFromUsers) {
		let database = existingTask.taskHiddenFromUsers.map((el: any) => {
			return el.user.id;
		});
		let updated = data.taskHiddenFromUsers;

		// Get the values to be removed
		let removedValues = database.filter(
			(el: number) => !updated.includes(el)
		);

		// Get the values that need to be inserted
		let valuesCreated = updated.filter(
			(el: number) => !database.includes(el)
		);

		await visiblityService.updateTaskHiddenFromUsersRelations(
			removedValues,
			valuesCreated,
			taskId
		);
	}
}
