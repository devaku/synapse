// Build Configuration
export const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Helper function: use env value in development, hardcoded default in production
const getConfig = (envValue: string | undefined, defaultValue: string) => {
	return isProduction ? defaultValue : (envValue || defaultValue);
};

// Helper function: for values from Kubernetes (env in both dev and prod)
const getKubeConfig = (envValue: string | undefined, fallback: string = '') => {
	return envValue || fallback;
};

// Helper function: for secrets from Kubernetes (always from env)
const getSecret = (envValue: string | undefined, fallback: string = '') => {
	return envValue || fallback;
};

// Server Configuration (hardcoded in production)
export const PORT = getConfig(process.env.PORT, '8080');
export const SERVER_URL = getConfig(process.env.SERVER_URL, 'http://localhost:8080');

// Database Configuration (from Kubernetes in production)
export const DATABASE_URL = getKubeConfig(process.env.DATABASE_URL, 'postgresql://myuser:mypassword@localhost:5432/synapse_db?schema=synapse');

// Keycloak Configuration (from Kubernetes in production)
export const KEYCLOAK_URL = getKubeConfig(process.env.KEYCLOAK_URL, '');
export const KEYCLOAK_CLIENT_REALM = getKubeConfig(process.env.KEYCLOAK_CLIENT_REALM, '');
export const KEYCLOAK_CLIENT_ID = getKubeConfig(process.env.KEYCLOAK_CLIENT_ID, '');

// Secrets (from Kubernetes Secrets in production)
export const KEYCLOAK_CLIENT_SECRET = getSecret(process.env.KEYCLOAK_CLIENT_SECRET);
export const SESSION_SECRET = getSecret(process.env.SESSION_SECRET, 'default-secret-change-in-production');
export const RSA256_PUBLIC_KEY = getSecret(process.env.RSA256_PUBLIC_KEY);
export const RSA_OAEP_PUBLIC_KEY = getSecret(process.env.RSA_OAEP_PUBLIC_KEY);

// GitHub Configuration (from Kubernetes in production)
export const GITHUB_CLIENT_ID = getKubeConfig(process.env.GITHUB_CLIENT_ID, '');
export const GITHUB_APP_ID = getKubeConfig(process.env.GITHUB_APP_ID, '');
export const GITHUB_INSTALLATION_ID = getKubeConfig(process.env.GITHUB_INSTALLATION_ID, '');

// GitHub Secrets (from Kubernetes Secrets in production)
export const GITHUB_CLIENT_SECRET = getSecret(process.env.GITHUB_CLIENT_SECRET);
export const GITHUB_PRIVATE_KEY_PATH = getSecret(process.env.GITHUB_PRIVATE_KEY_PATH);

// MCP Configuration (optional, for Model Context Protocol server)
export const MCP_USER_ID = process.env.MCP_USER_ID ? parseInt(process.env.MCP_USER_ID) : 1;

// AI Service Configuration (hardcoded in production)
export const AI_PROVIDER = getConfig(process.env.AI_PROVIDER, 'server'); // 'ollama' for local, 'server' for remote
export const AI_API_URL = getConfig(process.env.AI_API_URL, 'http://localhost:11434'); // Ollama default or remote server
export const AI_MODEL_NAME = getConfig(process.env.AI_MODEL_NAME, 'phi3');
export const AI_ENABLE_MCP_TOOLS = getConfig(process.env.AI_ENABLE_MCP_TOOLS, 'true') !== 'false'; // Default true
export const AI_USE_SIMPLE_MODE = getConfig(process.env.AI_USE_SIMPLE_MODE, 'false') === 'true'; // Default false

// AI Secret (from Kubernetes Secret in production)
export const AI_API_KEY = getSecret(process.env.AI_API_KEY);

// Image Storage Configuration (hardcoded in production)
export const IMAGE_STORAGE_URL = `${SERVER_URL}/public/uploads`;
export const IMAGE_STORAGE_PATH = ``;