import { prismaDb } from '../lib/database';
import { PrismaClientOrTransaction } from '../types';

export async function linkImagesToComments(
	tx: PrismaClientOrTransaction,
	imageIds: number[],
	commentId: number
) {
	const rows = await tx.imagesAttachedToComments.createMany({
		data: imageIds.map((el) => {
			return {
				imageId: el,
				commentId,
			};
		}),
	});

	return rows;
}
