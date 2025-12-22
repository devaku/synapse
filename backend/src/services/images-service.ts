import { PrismaClientOrTransaction } from '../types';

type imageType = {
	imageBlob: Buffer;
	mimeType: string;
	imageUrl: string;
};

export const createImageService = (tx: PrismaClientOrTransaction) => {
	return {
		createImage: async function createImage(
			userId: number,
			images: imageType[]
		) {
			let finalData = images.map((el, index) => {
				return {
					imageBlob: Buffer.from(el.imageBlob),
					userId,
					imageUrl: el.imageUrl,
					mimeType: el.mimeType,
				};
			});

			// Store the blob images
			// Retrieve the newly stored images
			const row = await tx.image.createManyAndReturn({
				data: [...finalData],
				omit: {
					imageBlob: true,
				},
			});

			return row;
		},

		readLatestId: async function readLatestId() {
			// Store the blob images
			// Retrieve the newly stored images
			const {
				_max: { id: maxId },
			} = await tx.image.aggregate({ _max: { id: true } });

			return maxId;
		},

		readImage: async function readImage(imageId: number) {
			const row = await tx.image.findFirst({
				where: {
					id: imageId,
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
