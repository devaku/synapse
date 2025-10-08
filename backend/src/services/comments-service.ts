import { User } from '../../database/generated/prisma';
import { prismaDb } from '../lib/database';

export async function createComment(
	userId: number,
	taskId: number,
	message: string
) {
	const row = await prismaDb.comment.create({
		data: {
			message,
			userId,
			taskId,
		},
	});

	return row;
}

export async function readComment(taskId: number) {
	const rows = await prismaDb.comment.findMany({
		where: {
			taskId,
		},
		include: {
			imagesAttachedToComments: {
				select: { image: true },
			},
			task: true,
			user: true,
		},
	});

	return rows;
}
