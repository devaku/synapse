import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import 'express-session';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../database/generated/prisma';

import { buildResponse, buildError } from '../lib/response-helper';
import { upsertUser } from '../services/user-service';

// Concept of declaration merging
// provided by Chatgpt
declare module 'express-session' {
	interface SessionData {
		userData: {
			user: User;
			roles: string[];
		};
	}
}

export async function verifyJwt(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// Extract the token from
		const token = req.headers.authorization?.split(' ')[1];

		// If token doesn't exist, user is not login
		if (!token) {
			let response = buildResponse(401, 'Access denied', {
				error: 'Unauthorized Request',
			});

			return res.status(401).json(response);
		}

		const public_key =
			'-----BEGIN PUBLIC KEY-----\n' +
			process.env.RSA256_PUBLIC_KEY +
			'\n-----END PUBLIC KEY-----';

		// Validate token
		const decoded = jwt.verify(token, public_key, {
			algorithms: ['RS256'],
		});

		const sessionJson = await loadIntoSession(decoded);
		req.session.userData = sessionJson;
		next();
	} catch (error) {
		if (error instanceof JsonWebTokenError) {
			let response = buildError(401, 'Authentication Error', error);
			res.status(401).json(response);
		} else {
			let response = buildError(401, 'Error', error);
			res.status(401).json(response);
		}
	}
}

/**
 * Store relevant information to the session
 * @param decoded
 */
async function loadIntoSession(decoded: any) {
	// Update user data in local db in case there are changes
	const userData: any = {
		keycloakId: decoded.sub,
		username: decoded.preferred_username,
		email: decoded.email,
		firstName: decoded.given_name,
		lastName: decoded.family_name,
		phone: null,
		lastActivity: new Date(),
		isDeleted: 0,
	};

	let userRow = await upsertUser(userData);

	// console.log(decoded);

	// Attach User and roles onto session
	// Slap roles
	const sessionJson = {
		user: userRow,
		roles: [...decoded.resource_access.client_synapse.roles],
	};

	return sessionJson;
}
