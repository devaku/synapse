import express from 'express';
import { Request, Response } from 'express';
const debugRouter = express.Router();

debugRouter.get('/debug', (req: Request, res: Response) => {
	res.json({
		message: 'This is the debug route',
	});
});

export default debugRouter;
