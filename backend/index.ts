import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const PORT = process.env.PORT;

import router from './src/routes';

app.use(router);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.json({
		status: 'success',
	});
});

app.listen(PORT, () => {
	console.log(`Express is listening at ${PORT}`);
});
