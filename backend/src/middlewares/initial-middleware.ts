import express, { Express } from 'express';
import cors from 'cors';
import { sessionMiddleware } from './session-middleware';

export function setupServerMiddleware(app: Express) {
	// Server static files
	app.use('/public', express.static('public'));

	// Attach session
	app.use(sessionMiddleware);

	// Load CORS
	app.use(
		cors({
			origin: ['http://localhost:3000', 'http://localhost:8080'],
			credentials: true,
		})
	);
}
