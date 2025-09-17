import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import router from './src/routes/main';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;

// Load the ENV settings
dotenv.config();

// Load CORS
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);

// Parse the cookies attached to the request
app.use(cookieParser());

// app.use((req: Request, res: Response, next: NextFunction) => {
// 	console.log('HEADERS');
// 	console.log(req.headers);
// 	console.log('COOKIES');
// 	console.log(req.cookies);

// 	next();
// });

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
