import { PrismaClientOrTransaction } from '../types';

export const createImageLinkService = (tx: PrismaClientOrTransaction) => {
	return {
		linkImagesToComments: async function linkImagesToComments(
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
		},

		linkImagesToTasks: async function linkImagesToTasks(
			imageIds: number[],
			taskId: number
		) {
			const rows = await tx.imagesAttachedToTasks.createMany({
				data: imageIds.map((el) => {
					return {
						imageId: el,
						taskId,
					};
				}),
			});

			return rows;
		},

		unlinkImagesToTasks: async function unlinkImagesToTasks(
			imageIds: number[],
			taskId: number
		) {
			const rows = await tx.imagesAttachedToTasks.deleteMany({
				where: {
					taskId,
					imageId: {
						in: imageIds,
					},
				},
			});

			return rows;
		},
	};
};
