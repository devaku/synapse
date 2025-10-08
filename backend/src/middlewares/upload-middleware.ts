import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
const STORAGE_LOCATION = `${path.join(__dirname, '..')}/public/uploads`;

// Create folder if it doesn't exist
fs.mkdirSync(STORAGE_LOCATION, { recursive: true });

const uploader = multer.diskStorage({
	/**
	 * FILENAME GENERATION <TIMESTAMP><random uuid>.<EXTENSION>
	 */
	filename(req, file, callback) {
		const timestamp = formatDate(new Date());
		let foo = file.mimetype.split('/');
		let extension = foo[1];

		const finalFilename = `${timestamp}-${uuidv4()}.${extension}`;
		callback(null, finalFilename);
	},

	/**
	 * WHERE TO STORE THE FILE
	 */
	destination(req, file, callback) {
		req.upload_location = STORAGE_LOCATION;
		callback(null, STORAGE_LOCATION);
	},
});

const acceptedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];

export const uploadMiddleware = multer({
	storage: uploader,
	fileFilter(req, file, callback) {
		// console.log('FILE FILTERING');
		// console.log(file);

		// If MIME TYPE of file is in the accepted list
		if (acceptedMimeTypes.includes(file.mimetype)) {
			// To accept the file pass `true`, like so:
			callback(null, true);
		} else {
			// To reject this file pass `false`, like so:
			callback(null, false);
		}
		// The function should call `cb` with a boolean
		// to indicate if the file should be accepted

		// You can always pass an error if something goes wrong:
		// callback(new Error("I don't have a clue!"));
	},
});

function formatDate(date: Date) {
	const pad = (n: any) => n.toString().padStart(2, '0');

	const month = pad(date.getMonth() + 1); // Months are 0-indexed
	const day = pad(date.getDate());
	const year = date.getFullYear().toString();
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const seconds = pad(date.getSeconds());

	return `${year}-${month}-${day}-${hours}${minutes}${seconds}`;
}
