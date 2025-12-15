import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

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

		const finalFilename = `${timestamp}-${crypto.randomUUID()}.${extension}`;
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

const acceptedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

// File magic bytes (signatures) for validation
const FILE_SIGNATURES: { [key: string]: Buffer[] } = {
	'image/png': [Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])],
	'image/jpeg': [Buffer.from([0xFF, 0xD8, 0xFF])],
	'image/jpg': [Buffer.from([0xFF, 0xD8, 0xFF])],
	'image/gif': [Buffer.from([0x47, 0x49, 0x46, 0x38, 0x37, 0x61]), Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61])],
};

/**
 * Validates file content by checking magic bytes (file signatures)
 * This prevents MIME type spoofing attacks
 */
function validateFileSignature(buffer: Buffer, mimeType: string): boolean {
	const signatures = FILE_SIGNATURES[mimeType];
	if (!signatures) {
		return false;
	}

	return signatures.some(signature => {
		return buffer.subarray(0, signature.length).equals(signature);
	});
}

export const uploadMiddleware = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit
	},
	fileFilter(req, file, callback) {
		// SECURITY: Validate MIME type
		if (!acceptedMimeTypes.includes(file.mimetype)) {
			return callback(new Error('Invalid file type. Only PNG, JPEG, and GIF images are allowed.'));
		}

		// Note: File buffer validation happens after multer processes the file
		// We'll validate in the controller or add a custom storage handler
		callback(null, true);
	},
});

/**
 * Additional validation function to check file signatures after upload
 * Call this in controllers after receiving files
 */
export function validateUploadedFiles(files: Express.Multer.File[]): { valid: boolean; error?: string } {
	for (const file of files) {
		if (!acceptedMimeTypes.includes(file.mimetype)) {
			return { valid: false, error: `Invalid MIME type: ${file.mimetype}` };
		}

		if (!file.buffer || file.buffer.length === 0) {
			return { valid: false, error: 'File buffer is empty' };
		}

		// Validate file signature
		if (!validateFileSignature(file.buffer, file.mimetype)) {
			return { valid: false, error: `File content does not match declared type: ${file.mimetype}` };
		}

		// Check file size (additional check)
		if (file.size > 10 * 1024 * 1024) {
			return { valid: false, error: 'File size exceeds 10MB limit' };
		}
	}

	return { valid: true };
}

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
