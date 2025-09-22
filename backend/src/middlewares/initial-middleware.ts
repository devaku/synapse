import express, { Express } from 'express';
import cors from 'cors';
import { sessionMiddleware } from './session-middleware';

export function setupServerMiddleware(app: Express) {
	// Server static files
	app.use('/public', express.static('public'));

	// Attach session
	app.use(sessionMiddleware);

	// app.use((req: Request, res: Response, next: NextFunction) => {
	// 	console.log('Session ID:', req.sessionID);
	// 	next();
	// });

	// Load CORS
	app.use(
		cors({
			origin: ['http://localhost:3000', 'http://localhost:8080'],
			credentials: true,
		})
	);
}
