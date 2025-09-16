export const DATABASE_URL = process.env.DATABASE_URL
	? process.env.DATABASE_URL
	: '';

export const KEYCLOAK_URL = process.env.KEYCLOAK_URL
	? process.env.KEYCLOAK_URL
	: '';
export const KEYCLOAK_CLIENT_REALM = process.env.KEYCLOAK_CLIENT_REALM
	? process.env.KEYCLOAK_CLIENT_REALM
	: '';
export const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID
	? process.env.KEYCLOAK_CLIENT_ID
	: '';
export const KEYCLOAK_CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET
	? process.env.KEYCLOAK_CLIENT_SECRET
	: '';

export const SESSION_SECRET = process.env.SESSION_SECRET
	? process.env.SESSION_SECRET
	: 'DERGS';
