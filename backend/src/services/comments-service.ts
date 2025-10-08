import { PrismaClient, Prisma } from '@prisma/client';
import { prismaDb } from '../lib/database';

type PrismaClientOrTransaction = PrismaClient | Prisma.TransactionClient;

export async function createComment(
	tx: PrismaClientOrTransaction,
	userId: number,
	taskId: number,
	message: string
) {
	let row = await tx.comment.create({
		data: {
			message,
			userId,
			taskId,
		},
	});
	return row;
}

export async function readComment(
	tx: PrismaClientOrTransaction,
	taskId: number
) {
	const rows = await tx.comment.findMany({
		where: {
			taskId,
		},
		include: {
			imagesAttachedToComments: {
				select: { image: true },
			},
			task: true,
			user: {
				include: {
					image: true,
				},
			},
		},
	});

	return rows;
}
