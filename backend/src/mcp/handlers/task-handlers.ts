import * as taskService from '../../services/task-service';
import * as subscriptionService from '../../services/task-subscription-service';
import * as visibilityService from '../../services/visibility-service';
import { prismaDb } from '../../lib/database';

export class TaskHandlers {
	/**
	 * Create a new task
	 */
	static async createTask(params: any, userId: number) {
		try {
			// Attach creator
			params.createdByUserId = userId;

			// Set default priority
			if (!params.priority) {
				params.priority = 'MEDIUM';
			}

			// Build visibility rules (similar to createTaskVisiblityRules)
			let visibleUserIds: number[] = params.taskVisibleToUsers || [];

			// Always include creator
			if (!visibleUserIds.includes(userId)) {
				visibleUserIds.push(userId);
			}

			params.taskVisibleToUsers = {
				create: visibleUserIds.map((id) => ({ userId: id })),
			};

			if (params.taskVisibleToTeams) {
				params.taskVisibleToTeams = {
					create: params.taskVisibleToTeams.map((id: number) => ({
						teamId: id,
					})),
				};
			}

			if (params.taskHiddenFromUsers) {
				params.taskHiddenFromUsers = {
					create: params.taskHiddenFromUsers.map((id: number) => ({
						userId: id,
					})),
				};
			}

			// Auto-subscribe creator
			params.taskUserSubscribeTo = {
				create: { userId },
			};

			const task = await taskService.createTask(params);

			return {
				success: true,
				data: task,
				message: 'Task created successfully',
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message,
				message: 'Failed to create task',
			};
		}
	}

	/**
	 * Read tasks
	 */
	static async readTasks(params: any, userId: number) {
		try {
			let tasks;
			let message = '';

			if (params.taskId) {
				// Read specific task
				const task = await taskService.readTaskById(params.taskId);
				tasks = task ? [task] : [];
				message = task
					? 'Task retrieved successfully'
					: 'Task not found';
			} else if (params.subscribedOnly) {
				// Read subscribed tasks
				tasks = await taskService.readTasksUserIsSubscribedTo(userId);
				message = `Found ${tasks.length} subscribed tasks`;
			} else if (params.userOnly) {
				// Read tasks visible to user
				tasks = await taskService.readTasksFilteredForUser(userId);
				message = `Found ${tasks.length} visible tasks`;
			} else {
				// Read all tasks
				tasks = await taskService.readAllTask();
				message = `Found ${tasks.length} total tasks`;
			}

			return {
				success: true,
				data: tasks,
				message,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message,
				message: 'Failed to read tasks',
			};
		}
	}

	/**
	 * Update a task
	 */
	static async updateTask(params: any, userId: number) {
		try {
			const { taskId, ...updateData } = params;

			// Get existing task
			const existingTask = await taskService.readTaskById(taskId);
			if (!existingTask) {
				return {
					success: false,
					message: 'Task not found',
				};
			}

			// Ensure creator can always see the task
			if (updateData.taskVisibleToUsers) {
				updateData.taskVisibleToUsers.push(
					existingTask.createdByUserId
				);
			} else {
				updateData.taskVisibleToUsers = [existingTask.createdByUserId];
			}

			// Remove creator from hidden users
			if (updateData.taskHiddenFromUsers) {
				updateData.taskHiddenFromUsers =
					updateData.taskHiddenFromUsers.filter(
						(id: number) => id !== existingTask.createdByUserId
					);
			}

			// Update with transaction
			const updatedTask = await prismaDb.$transaction(async (tx) => {
				// Update visibility rules
				await this.updateVisibilityRules(tx, updateData, existingTask);

				// Remove visibility arrays from update data
				delete updateData.taskVisibleToUsers;
				delete updateData.taskHiddenFromUsers;
				delete updateData.taskVisibleToTeams;

				// Update task
				return await taskService.updateTask(tx, taskId, updateData);
			});

			return {
				success: true,
				data: updatedTask,
				message: 'Task updated successfully',
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message,
				message: 'Failed to update task',
			};
		}
	}

	/**
	 * Subscribe to task
	 */
	static async subscribeTask(params: any, userId: number) {
		try {
			const { taskId } = params;

			// Check if already subscribed
			const existingSubscription =
				await prismaDb.taskUserSubscribeTo.findUnique({
					where: {
						userId_taskId: { userId, taskId },
					},
				});

			if (existingSubscription) {
				return {
					success: false,
					message: 'Already subscribed to this task',
				};
			}

			await subscriptionService.subscribeToTask(userId, taskId);

			return {
				success: true,
				message: 'Subscribed to task successfully',
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message,
				message: 'Failed to subscribe to task',
			};
		}
	}

	/**
	 * Unsubscribe from task
	 */
	static async unsubscribeTask(params: any, userId: number) {
		try {
			const { taskId } = params;

			await subscriptionService.unsubscribeFromTask(userId, taskId);

			return {
				success: true,
				message: 'Unsubscribed from task successfully',
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message,
				message: 'Failed to unsubscribe from task',
			};
		}
	}

	/**
	 * Helper: Update visibility rules (similar to updateTaskVisiblityRules)
	 */
	private static async updateVisibilityRules(
		tx: any,
		data: any,
		existingTask: any
	) {
		const taskId = existingTask.id;

		// Update visible teams
		if (data.taskVisibleToTeams) {
			const database = existingTask.taskVisibleToTeams.map(
				(el: any) => el.teamId
			);
			const updated = data.taskVisibleToTeams;
			const removedValues = database.filter(
				(el: number) => !updated.includes(el)
			);
			const valuesCreated = updated.filter(
				(el: number) => !database.includes(el)
			);

			await visibilityService.updateTaskVisibleToTeamsRelations(
				tx,
				removedValues,
				valuesCreated,
				taskId
			);
		}

		// Update visible users
		if (data.taskVisibleToUsers) {
			const database = existingTask.taskVisibleToUsers.map(
				(el: any) => el.userId
			);
			const updated = data.taskVisibleToUsers;
			const removedValues = database.filter(
				(el: number) => !updated.includes(el)
			);
			const valuesCreated = updated.filter(
				(el: number) => !database.includes(el)
			);

			await visibilityService.updateTaskVisibleToUsersRelations(
				tx,
				removedValues,
				valuesCreated,
				taskId
			);
		}

		// Update hidden users
		if (data.taskHiddenFromUsers) {
			const database = existingTask.taskHiddenFromUsers.map(
				(el: any) => el.userId
			);
			const updated = data.taskHiddenFromUsers;
			const removedValues = database.filter(
				(el: number) => !updated.includes(el)
			);
			const valuesCreated = updated.filter(
				(el: number) => !database.includes(el)
			);

			await visibilityService.updateTaskHiddenFromUsersRelations(
				tx,
				removedValues,
				valuesCreated,
				taskId
			);
		}
	}
}
