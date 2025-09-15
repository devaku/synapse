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
