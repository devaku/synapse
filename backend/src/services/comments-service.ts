import { PrismaClientOrTransaction } from '../types';

export const createCommentService = (tx: PrismaClientOrTransaction) => {
	return {
		createComment: async function createComment(
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
		},

		readComment: async function readComment(
			tx: PrismaClientOrTransaction,
			taskId: number
		) {
			const rows = await tx.comment.findMany({
				where: {
					taskId,
				},
				include: {
					imagesAttachedToComments: {
						select: {
							image: {
								omit: {
									imageBlob: true,
								},
							},
						},
					},
					task: true,
					user: {
						include: {
							image: {
								omit: {
									imageBlob: true,
								},
							},
						},
					},
				},
			});

			return rows;
		},
	};
};
