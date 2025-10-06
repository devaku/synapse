import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import router from './routes/main';
import favicon from 'serve-favicon';
import path from 'path';

import { setupServerMiddleware } from './middlewares/initial-middleware';
import { socketMiddleware } from './middlewares/socket-middleware';

const app = express();

const PORT = process.env.PORT;

// Load the ENV settings
dotenv.config();

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
const httpServer = app.listen(PORT, () => {
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
