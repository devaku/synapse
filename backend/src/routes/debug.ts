import express from 'express';
import { Request, Response } from 'express';
import { verifyJwt } from '../middlewares/auth-middleware';

const debugRouter = express.Router();

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

export default debugRouter;
