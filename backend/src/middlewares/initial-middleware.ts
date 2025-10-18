import express, { Express } from 'express';
import cors from 'cors';
import { sessionMiddleware } from './session-middleware';
import path from 'path';
import { corsValues } from '../lib/cors';
const PUBLIC_FOLDER = `${path.join(__dirname, '..')}/public`;

export function setupServerMiddleware(app: Express) {
	// Server static files
	app.use('/public', express.static(PUBLIC_FOLDER));

	// Attach session
	app.use(sessionMiddleware);

	// Load CORS
	app.use(
		cors({
			// origin: '*',
			origin: corsValues,
			credentials: true,
		})
	);
}
