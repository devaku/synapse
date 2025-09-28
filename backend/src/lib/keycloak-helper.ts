import Keycloak from 'keycloak-connect';
import session from 'express-session';
import keycloakConfig from '../../config/keycloak.json';
import { SESSION_SECRET } from './env-variables';

// needed to manage server-side states for
const memoryStore = new session.MemoryStore();

// authentication
// export const sessionMiddleware = session({
// 	secret: SESSION_SECRET,
// 	resave: false,
// 	saveUninitialized: true,
// 	store: memoryStore,
// });

// export const keycloak = new Keycloak(
// 	{
// 		store: memoryStore,
// 	},
// 	keycloakConfig
// );
