import express from 'express';
import { Request, Response } from 'express';
import { uploadMiddleware } from '../middlewares/upload-middleware';
import { pingUsersOfNewCommentOnTask } from '../lib/helpers/socket-helper';

const debugRouter = express.Router();

debugRouter.get('/', (req: Request, res: Response) => {
	res.json({
		message: 'This is the debug route',
	});
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
	(req: Request, res: Response) => {
		console.log(req.files);

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
