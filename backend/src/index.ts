import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import router from './routes/main';
import favicon from 'serve-favicon';
import path from 'path';

import { setupServerMiddleware } from './middlewares/initial-middleware';
import { socketMiddleware } from './middlewares/socket-middleware';
import { PORT } from './lib/env-variables';

globalThis.ROOT_DIR = __dirname;
const ENV_PATH = path.join(__dirname, '..', '.env');

// Load the ENV settings
dotenv.config({ path: ENV_PATH });

const app = express();

// Setup favicon. Have to be at the very start. lol
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.get('/docker', (req: Request, res: Response, next: NextFunction) => {
	res.json({
		status: 'success',
		message: 'Image is working correctly!',
	});
	return;
});

// Setup middlewares
setupServerMiddleware(app);

// Setup socket
const host = '0.0.0.0';
const httpServer = app.listen(Number(PORT), host, () => {
	console.log(`Server is listening at PORT: ${PORT}`);
});
const io = socketMiddleware(httpServer);
app.use((req: Request, res: Response, next: NextFunction) => {
	req.io = io;
	next();
});

// Load the routes
app.use(router);

// var http = require('http') ,
// express = require('express') ,
//  app = express();

// http.createServer(app).listen(80);
// https.createServer({ ... }, app).listen(443);
