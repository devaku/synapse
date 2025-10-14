import express from 'express';
import { Request, Response } from 'express';
import { uploadMiddleware } from '../middlewares/upload-middleware';

const debugRouter = express.Router();

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

debugRouter.get('/debug', (req: Request, res: Response) => {
	res.json({
		message: 'This is the debug route',
	});
});

debugRouter.get('/socket', (req: Request, res: Response) => {
	req.io.emit('TASK:DEBUG', { status: 'HELLOOOO' });
	res.json({
		message: 'This is the debug route',
	});
});

export default debugRouter;
