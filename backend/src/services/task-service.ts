import { prisma } from '../lib/database';
import { Task, Team, User } from '../../database/generated/prisma';
import { readUser } from './user-service';

export async function createTask(task: Task) {
	const taskRow = await prisma.task.create({
		data: {
			...task,
		},
	});

	return taskRow;
}

/**
 * Return ALL available tasks in the database
 * Not filtered.
 * @returns
 */
export async function readAllTask() {
	const taskRow = await prisma.task.findMany({
		where: {
			isDeleted: 0,
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
			// comments: true,
		},
	});
	return taskRow;
}

/**
 * Returns ALL available tasks
 * based on Task's filterings
 * @returns
 */
export async function readTasksFilteredForUser(userId: number) {
	// Get the teams the user belongs to;
	const userRow = await readUser(userId);

	// If user not found
	if (!userRow) {
		return [];
	}

	const teamList = userRow.team.map((el) => el.id);
	console.log('USERID: ', userId);
	console.log('TEAMS THEY ARE IN: ', teamList);

	// Prisma query provided by chatgpt
	const taskRow = await prisma.task.findMany({
		where: {
			isDeleted: 0,
			OR: [
				// 1. Task is visible directly to the user
				{
					taskVisibleToUsers: {
						some: {
							userId: userId,
						},
					},
				},
				// 2. Task is visible to a team the user is in
				{
					taskVisibleToTeams: {
						some: {
							team: {
								User: {
									some: {
										id: userId,
									},
								},
							},
						},
					},
				},
			],
			// 3. Exclude tasks hidden from the user
			taskHiddenFromUsers: {
				none: {
					userId: userId,
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

	return taskRow;
}

/**
 * Soft deletes a row
 * @param id
 * @returns
 */
export async function deleteTask(id: number) {
	const taskRow = await prisma.task.update({
		where: {
			id,
		},
		data: {
			isDeleted: 1,
		},
	});
	return taskRow;
}
