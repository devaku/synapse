import express from 'express';
import { Request, Response } from 'express';
import { verifyJwt } from '../middlewares/auth-middleware';
import { keycloak } from '../lib/keycloak-helper';

const debugRouter = express.Router();

debugRouter.get(
	'/debugWithAuth',
	// verifyJwt,
	keycloak.protect('client_synapse:roles:employees'),
	(req: Request, res: Response) => {
		res.json({
			message: 'This is an authenticated route',
		});
	}
);

debugRouter.get('/debug', (req: Request, res: Response) => {
	res.json({
		message: 'This is the debug route',
	});
});

export default debugRouter;
