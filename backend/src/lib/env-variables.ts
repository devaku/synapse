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
	: (() => {
			if (process.env.NODE_ENV === 'production') {
				throw new Error('SESSION_SECRET must be set in production environment');
			}
			console.warn('WARNING: Using default SESSION_SECRET. This is insecure for production!');
			return 'DERGS';
		})();

export const IMAGE_STORAGE_URL = `${process.env.SERVER_URL}/public/uploads`;
export const IMAGE_STORAGE_PATH = ``;

// AI Service Configuration
export const AI_PROVIDER = process.env.AI_PROVIDER || 'server'; // 'ollama' for local, 'server' for remote
export const AI_API_URL = process.env.AI_API_URL || 'http://localhost:11434'; // Ollama default or remote server
export const AI_API_KEY = process.env.AI_API_KEY || ''; // Only needed for remote server
export const AI_MODEL_NAME = process.env.AI_MODEL_NAME || 'phi3';
export const AI_ENABLE_MCP_TOOLS = process.env.AI_ENABLE_MCP_TOOLS !== 'false'; // Default true, set to 'false' to disable
export const AI_USE_SIMPLE_MODE = process.env.AI_USE_SIMPLE_MODE === 'true'; // Default false, set to 'true' for minimal requests
