import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import 'express-session';

// Concept of declaration merging
// provided by Chatgpt
declare module 'express-session' {
	interface SessionData {
		userData: any;
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
			return res.status(401).json({ error: 'Unauthorized Request' });
		}

		const public_key =
			'-----BEGIN PUBLIC KEY-----\n' +
			process.env.RSA256_PUBLIC_KEY +
			'\n-----END PUBLIC KEY-----';

		// Validate token
		const decoded = jwt.verify(token, public_key, {
			algorithms: ['RS256'],
		});

		const sessionJson = decodeJwt(decoded);
		req.session.userData = sessionJson;
		next();
	} catch (error) {
		console.error('Authentication error:', error);
		res.status(401).json({ error: 'Invalid token' });
	}
}

/**
 * Store relevant information to the session
 * @param decoded
 */
function decodeJwt(decoded: any) {
	let sessionJson = {
		sub: decoded.sub,
		realm_access: decoded.realm_access,
		name: decoded.name,
		given_name: decoded.given_name,
		family_name: decoded.family_name,
		email: decoded.email,
		preferred_username: decoded.preferred_username,
	};

	return sessionJson;
}
