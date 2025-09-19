import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { SESSION_SECRET, DATABASE_URL } from '../lib/env-variables';

const pgSession = connectPgSimple(session);
export const sessionMiddleware = session({
	name: 'synapse_api.sid',
	store: new pgSession({
		tableName: 'session',
		schemaName: 'synapse',
		conString: DATABASE_URL,
	}),
	cookie: {
		domain: 'localhost:8080',
		secure: 'auto',
		partitioned: false,
		path: '/',
	},
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
});
