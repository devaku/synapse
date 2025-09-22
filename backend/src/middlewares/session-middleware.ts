import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { SESSION_SECRET, DATABASE_URL } from '../lib/env-variables';
import 'express-session';

const pgSession = connectPgSimple(session);
export const sessionMiddleware = session({
	name: 'synapse_api.sid',
	store: new pgSession({
		tableName: 'Session',
		schemaName: 'synapse',
		conString: DATABASE_URL,
	}),
	cookie: {
		secure: 'auto',
		partitioned: false,
		path: '/',
	},
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
});
