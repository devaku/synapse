import { createImageService } from '../../services/images-service';

import { PrismaClientOrTransaction } from '../../types';

export const createImageHelper = () => {
	return {
		uploadImages: async function uploadImages(
			tx: PrismaClientOrTransaction,
			files: Express.Multer.File[] | undefined,
			userId: number
		) {
			const imageService = createImageService(tx);

			// Save the images
			let finalRows;
			if (files) {
				const uploaded = files;
				if (uploaded.length > 0) {
					// Get the latest ID from the database
					let maxId = await imageService.readLatestId();
					if (maxId == null) {
						maxId = 1;
					}

					// Create the row array
					const images = uploaded.map((el: any, index) => {
						return {
							imageBlob: Buffer.from(el.buffer),

							// TODO: Change URL to an official one
							imageUrl: `${
								process.env.SERVER_URL
							}/api/v1/debug/image/${maxId + index + 1}`,
							mimeType: el.mimetype,
						};
					});
					finalRows = await imageService.createImage(userId!, images);
				}
			}

			return finalRows;
		},
	};
};
