import { prismaDb } from '../lib/database';

export async function createImage(userId: number, images: string[]) {
	let finalData = images.map((el) => {
		return {
			imageUrl: el,
			userId,
		};
	});

	await prismaDb.image.createMany({
		data: [...finalData],
	});

	const row = await prismaDb.image.findMany({
		where: {
			imageUrl: {
				in: finalData.map((el) => el.imageUrl),
			},
		},
	});

	return row;
}
