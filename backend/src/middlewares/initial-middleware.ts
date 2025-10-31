import express, { Express } from 'express';

import { sessionMiddleware } from './session-middleware';
import path from 'path';

const PUBLIC_FOLDER = `${path.join(__dirname, '..')}/public`;

export function setupServerMiddleware(app: Express) {
	// Server static files
	app.use('/', express.static(PUBLIC_FOLDER));

	// Attach session
	app.use(sessionMiddleware);
}
