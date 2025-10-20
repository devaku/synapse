import fs from 'fs';

export function deleteUploadedFiles(
	uploaded: Express.Multer.File[] | { filename: string }[],
	uploadLocation: string
) {
	const images = uploaded.map((el: any) => {
		return `${uploadLocation}/${el.filename}`;
	});
	// Begin deleting them
	images.map(async (el) => {
		fs.unlink(el, (err) => {
			if (err) {
				console.log(
					`Could not delete file: ${el}. File may not exist.`
				);
			}
		});
	});
}
