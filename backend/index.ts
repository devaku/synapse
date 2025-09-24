import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import router from './src/routes/main';
import favicon from 'serve-favicon';
import path from 'path';

import { setupServerMiddleware } from './src/middlewares/initial-middleware';
import { Server } from 'socket.io';
import { socketMiddleware } from './src/middlewares/socket-middleware';

const app = express();
const PORT = process.env.PORT;

// Load the ENV settings
dotenv.config();

// Setup favicon. Have to be at the very start. lol
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Setup middlewares
setupServerMiddleware(app);

// Load the routes
app.use(router);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.json({
		status: 'success',
	});
});

// Setup socket
const httpServer = app.listen(PORT, () => {
	console.log(`Server is listening at PORT: ${PORT}`);
});
const io = socketMiddleware(httpServer);
app.io = io;

// var http = require('http') ,
// express = require('express') ,
//  app = express();

// http.createServer(app).listen(80);
// https.createServer({ ... }, app).listen(443);
