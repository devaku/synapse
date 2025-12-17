// Build Configuration
export const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Helper function: use env value in development, hardcoded default in production
const getConfig = (envValue: string | undefined, defaultValue: string) => {
	return isProduction ? defaultValue : (envValue || defaultValue);
};

// Helper function: always use env value (for secrets)
const getSecret = (envValue: string | undefined, fallback: string = '') => {
	return envValue || fallback;
};

// Server Configuration
export const PORT = getConfig(process.env.PORT, '8080');
export const SERVER_URL = getConfig(process.env.SERVER_URL, 'http://localhost:8080');

// Database Configuration
export const DATABASE_URL = getConfig(process.env.DATABASE_URL, 'postgresql://myuser:mypassword@localhost:5432/synapse_db?schema=synapse');

// Keycloak Configuration
export const KEYCLOAK_URL = getConfig(process.env.KEYCLOAK_URL, '');
export const KEYCLOAK_CLIENT_REALM = getConfig(process.env.KEYCLOAK_CLIENT_REALM, '');
export const KEYCLOAK_CLIENT_ID = getConfig(process.env.KEYCLOAK_CLIENT_ID, '');

// Secrets - Always from .env
export const KEYCLOAK_CLIENT_SECRET = getSecret(process.env.KEYCLOAK_CLIENT_SECRET);
export const SESSION_SECRET = getSecret(process.env.SESSION_SECRET, 'default-secret-change-in-production');
export const RSA256_PUBLIC_KEY = getSecret(process.env.RSA256_PUBLIC_KEY);
export const RSA_OAEP_PUBLIC_KEY = getSecret(process.env.RSA_OAEP_PUBLIC_KEY);

// AI Service Configuration
export const AI_PROVIDER = getConfig(process.env.AI_PROVIDER, 'server'); // 'ollama' for local, 'server' for remote
export const AI_API_URL = getConfig(process.env.AI_API_URL, 'http://localhost:11434'); // Ollama default or remote server
export const AI_API_KEY = getSecret(process.env.AI_API_KEY); // Secret - always from .env
export const AI_MODEL_NAME = getConfig(process.env.AI_MODEL_NAME, 'phi3');
export const AI_ENABLE_MCP_TOOLS = process.env.AI_ENABLE_MCP_TOOLS !== 'false'; // Default true, set to 'false' to disable
export const AI_USE_SIMPLE_MODE = process.env.AI_USE_SIMPLE_MODE === 'true'; // Default false, set to 'true' for minimal requests
export const GITHUB_CLIENT_SECRET = getSecret(process.env.GITHUB_CLIENT_SECRET);
export const GITHUB_PRIVATE_KEY_PATH = getSecret(process.env.GITHUB_PRIVATE_KEY_PATH);

// Image Storage Configuration
export const IMAGE_STORAGE_URL = `${SERVER_URL}/public/uploads`;
export const IMAGE_STORAGE_PATH = ``;