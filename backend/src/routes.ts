import express, { Request, Response, NextFunction } from 'express';

import { prisma } from './lib/database';
import { getKeycloakToken, createKeycloakUser } from './lib/keycloak-helper';

const router = express.Router();

router.get(
	'/debug',
	async (req: Request, res: Response, next: NextFunction) => {
		const users = await prisma.user.count();

		let response = await getKeycloakToken();
		await createKeycloakUser(response.access_token);

		res.json({
			status: 'success',
			total: users,
			// response,
		});
	}
);

export default router;
