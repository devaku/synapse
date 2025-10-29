import express from 'express';
import { Request, Response } from 'express';
import { uploadMiddleware } from '../middlewares/upload-middleware';
import { pingUsersOfNewCommentOnTask } from '../lib/helpers/socket-helper';
import { createImageService } from '../services/images-service';
import { prismaDb } from '../lib/database';

const debugRouter = express.Router();
const imageService = createImageService(prismaDb);

debugRouter.get('/', (req: Request, res: Response) => {
	res.json({
		message: 'This is the debug route',
	});
});

debugRouter.get('/image/:id', async (req: Request, res: Response) => {
	const row = await imageService.readImage(1);
	res.set('Content-Type', row?.mimeType);
	res.send(row?.imageBlob);
});

debugRouter.post(
	'/notification',
	express.json(),
	(req: Request, res: Response) => {
		pingUsersOfNewCommentOnTask(req.io, req.body.userIdList, {
			notification: {
				title: req.body.title,
				description: req.body.description,
				createdByUserId: 1,
			},
			payload: req.body.payload,
		});
		res.json({
			message: 'Successfully sent notification',
		});
	}
);

debugRouter.post(
	'/upload',
	uploadMiddleware.array('pictures'),
	async (req: Request, res: Response) => {
		const userId = req.session.userData?.user.id;

		console.log(req.files);
		if (Array.isArray(req.files)) {
			const uploaded = req.files;
			if (uploaded.length > 0) {
				const images = uploaded.map((el: any) => {
					return {
						imageBlob: Buffer.from(el.buffer),
						mimeType: el.mimetype,
					};
				});
				// await imageService.createImage(5, images);
			}
		}

		res.json({
			message: 'This is the upload route',
		});
	}
);

debugRouter.get('/debugWithAuth', (req: Request, res: Response) => {
	res.json({
		message: 'This is an authenticated route',
	});
});

debugRouter.get('/socket', (req: Request, res: Response) => {
	req.io.emit('TASK:DEBUG', { status: 'HELLOOOO' });
	res.json({
		message: 'This is the debug route',
	});
});

export default debugRouter;
