import express, { Request, Response, NextFunction } from 'express';

import { prisma } from './lib/database';

const router = express.Router();

router.get(
	'/debug',
	async (req: Request, res: Response, next: NextFunction) => {
		const users = await prisma.user.count();

		res.json({
			status: 'success',
			total: users,
		});
	}
);

export default router;
