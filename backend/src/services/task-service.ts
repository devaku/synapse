import { Prisma } from '@prisma/client';
import { prismaDb } from '../lib/database';
import { Task } from '../../database/generated/prisma';
import { readUser } from './user-service';

// Used AI to help with the hidden features on the CRUD FUnctionality stuff, most of the code there is from ChatGPT
// PROMPT: "Help me with adding visibility to the CRUD functions"

/**
 * CREATE - Create a new task
 */
export async function createTask(taskObj: any) {
	const taskRow = await prismaDb.task.create({
		data: {
			...taskObj,
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
	return await prismaDb.task.findMany({
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
	return await prismaDb.task.findFirst({
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
			deletionRequest: { include: { requestedByUser: true } },
			taskHiddenFromUsers: {
				select: {
					user: {
						omit: {
							keycloakId: true,
						},
					},
				},
			},
			taskVisibleToTeams: {
				select: {
					team: true,
				},
			},
			taskVisibleToUsers: {
				select: {
					user: {
						omit: {
							keycloakId: true,
						},
					},
				},
			},
		},
	});
}

/**
 * READ TASKS FILTERED FOR USER
 */
export async function readTasksFilteredForUser(userId: number) {
	const userRow = await readUser(userId);
	if (!userRow) return [];

	return await prismaDb.task.findMany({
		where: {
			isArchived: 0,
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

export async function readTasksUserIsSubscribedTo(userId: number) {
	const userRow = await readUser(userId);
	if (!userRow) {
		return [];
	}

	return await prismaDb.task.findMany({
		where: {
			isArchived: 0,
			taskUserSubscribeTo: {
				some: {
					userId,
				},
			},
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
export async function updateTask(
	tx: Prisma.TransactionClient,
	id: number,
	data: Task
) {
	return await tx.task.update({
		where: { id },
		data: {
			...data,
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
}

export async function DEBUG_updateTask(id: number, data: Task) {
	return await prismaDb.task.update({
		where: { id: 10 },
		data: {
			name: 'postman',
			taskVisibleToTeams: {
				// create: {
				// 	team: {
				// 		connect: { id: 2 },
				// 	},
				// },
			},
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
}

/**
 * DELETE TASK (Soft Delete)
 */
export async function deleteTask(id: number) {
	return await prismaDb.task.update({
		where: { id },
		data: { isDeleted: 1 },
	});
}
