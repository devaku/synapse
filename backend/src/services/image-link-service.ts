import { prismaDb } from '../lib/database';

export async function linkImagesToComments(
	imageIds: number[],
	commentId: number
) {
	const rows = await prismaDb.imagesAttachedToComments.createMany({
		data: imageIds.map((el) => {
			return {
				imageId: el,
				commentId,
			};
		}),
	});

	return rows;
}
