import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import router from './src/routes/main';
import favicon from 'serve-favicon';
import path from 'path';

import { setupServerMiddleware } from './src/middlewares/initial-middleware';

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

app.listen(PORT, () => {
	console.log(`Express is listening at ${PORT}`);
});
