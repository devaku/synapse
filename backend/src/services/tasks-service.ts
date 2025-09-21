import { prisma } from '../lib/database';
import { Task } from '../../database/generated/prisma';

export async function createTask(task: Task) {
	const taskRow = await prisma.task.create({
		data: {
			...task,
		},
	});

	return taskRow;
}

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
			assignedToUser: {
				select: {
					id: true,
					username: true,
					firstName: true,
					lastName: true,
				},
			},
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
