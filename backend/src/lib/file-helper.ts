import fs from 'fs/promises';
export function deleteUploadedFiles(
	uploaded: Express.Multer.File[],
	uploadLocation: string
) {
	const images = uploaded.map((el: any) => {
		return `${uploadLocation}/${el.filename}`;
	});

	// Begin deleting them
	images.map(async (el) => {
		await fs.unlink(el);
	});
}
