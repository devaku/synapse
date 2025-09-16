import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import router from './src/routes/main';
import session from 'express-session';
import { keycloak, sessionMiddleware } from './src/lib/keycloak-helper';

const app = express();
const PORT = process.env.PORT;

// Load the ENV settings
dotenv.config();

// Load session
app.use(sessionMiddleware);
app.use(keycloak.middleware());

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
