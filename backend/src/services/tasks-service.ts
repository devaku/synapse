import { prisma } from '../lib/database';
import { taskType } from '../types';

export async function createTask(task: taskType) {
	const taskRow = await prisma.task.create({
		data: {
			...task,
		},
	});

	return taskRow;
}

export async function readAllTask() {
	const taskRow = await prisma.task.findMany();
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
