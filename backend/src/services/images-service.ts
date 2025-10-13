import { PrismaClientOrTransaction } from '../types';

export const createImageService = (tx: PrismaClientOrTransaction) => {
	return {
		createImage: async function createImage(
			userId: number,
			images: string[]
		) {
			let finalData = images.map((el) => {
				return {
					imageUrl: el,
					userId,
				};
			});

			await tx.image.createMany({
				data: [...finalData],
			});

			const row = await tx.image.findMany({
				where: {
					imageUrl: {
						in: finalData.map((el) => el.imageUrl),
					},
				},
			});

			return row;
		},

		deleteImages: async function deleteImages(images: number[]) {
			await tx.image.deleteMany({
				where: {
					id: {
						in: images,
					},
				},
			});
		},
	};
};
