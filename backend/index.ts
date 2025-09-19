import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import router from './src/routes/main';
import favicon from 'serve-favicon';
import path from 'path';
import { sessionMiddleware } from './src/middlewares/session-middleware';
import cors from 'cors';

// Concept of declaration merging
// provided by Chatgpt
declare module 'express-session' {
	interface SessionData {
		userData: any;
	}
}

const app = express();
const PORT = process.env.PORT;

// Load the ENV settings
dotenv.config();

// Server static files
app.use('/public', express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Attach session
app.use(sessionMiddleware);

// Load CORS
app.use(
	cors({
		origin: ['http://localhost:3000', 'http://localhost:8080'],
		credentials: true,
	})
);

app.use((req: Request, res: Response, next: NextFunction) => {
	console.log('Session ID:', req.sessionID);
	next();
});

// Load the routes
app.use(router);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.json({
		status: 'success',
	});
});

app.listen(PORT, () => {
	console.log(`Express is listening at ${PORT}`);
});
