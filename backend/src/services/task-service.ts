import { prisma } from '../lib/database';
import { Task } from '../../database/generated/prisma';
import { readUser } from './user-service';

// Used AI to help with the hidden features on the CRUD FUnctionality stuff, most of the code there is from ChatGPT
// PROMPT: "Help me with adding visibility to the CRUD functions"

/**
 * CREATE - Create a new task
 */
export async function createTask(task: Partial<Task>) {
	const taskRow = await prisma.task.create({
		data: {
			name: task.name!,
			description: task.description!,
			createdByUserId: task.createdByUserId!,
			priority: task.priority || 'MEDIUM',
			image: task.image || null,
			startDate: task.startDate || null,
			completeDate: task.completeDate || null,
		},
		include: {
			createdByUser: {
				select: {
					id: true,
					username: true,
					firstName: true,
					lastName: true,
				},
			},
			taskHiddenFromUsers: true,
			taskVisibleToTeams: true,
			taskVisibleToUsers: true,
		},
	});
	return taskRow;
}

/**
 * READ ALL TASKS
 */
export async function readAllTask() {
	return await prisma.task.findMany({
		where: { isDeleted: 0 },
		include: {
			createdByUser: {
				select: {
					id: true,
					username: true,
					firstName: true,
					lastName: true,
				},
			},
			taskHiddenFromUsers: true,
			taskVisibleToTeams: true,
			taskVisibleToUsers: true,
		},
	});
}

/**
 * READ TASK BY ID
 */
export async function readTaskById(id: number) {
	return await prisma.task.findFirst({
		where: { id, isDeleted: 0 },
		include: {
			createdByUser: {
				select: {
					id: true,
					username: true,
					firstName: true,
					lastName: true,
				},
			},
			taskHiddenFromUsers: true,
			taskVisibleToTeams: true,
			taskVisibleToUsers: true,
		},
	});
}

/**
 * READ TASKS FILTERED FOR USER
 */
export async function readTasksFilteredForUser(userId: number) {
	const userRow = await readUser(userId);
	if (!userRow) return [];

	return await prisma.task.findMany({
		where: {
			isDeleted: 0,
			OR: [
				{ taskVisibleToUsers: { some: { userId } } },
				{
					taskVisibleToTeams: {
						some: {
							team: { teamsUsersBelongTo: { some: { userId } } },
						},
					},
				},
			],
			taskHiddenFromUsers: { none: { userId } },
		},
		include: {
			createdByUser: true,
			comments: true,
			taskVisibleToUsers: true,
			taskVisibleToTeams: true,
		},
	});
}

/**
 * UPDATE TASK
 */
export async function updateTask(id: number, data: Partial<Task>) {
	return await prisma.task.update({
		where: { id },
		data: data,
		include: {
			createdByUser: {
				select: {
					id: true,
					username: true,
					firstName: true,
					lastName: true,
				},
			},
			taskHiddenFromUsers: true,
			taskVisibleToTeams: true,
			taskVisibleToUsers: true,
		},
	});
}

/**
 * DELETE TASK (Soft Delete)
 */
export async function deleteTask(id: number) {
	return await prisma.task.update({
		where: { id },
		data: { isDeleted: 1 },
	});
}
