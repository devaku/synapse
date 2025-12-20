// Build Configuration
// Vite uses import.meta.env.MODE which is 'development' or 'production' based on build command
export const NODE_ENV = import.meta.env.MODE || 'development';
const isProduction = NODE_ENV === 'production';

// Helper function: use env value in development, hardcoded default in production
const getConfig = (envValue: string | undefined, defaultValue: string) => {
	return isProduction ? defaultValue : (envValue || defaultValue);
};

// Server Configuration (hardcoded in production)
export const SERVER_URL = getConfig(import.meta.env.VITE_SERVER_URL, 'http://localhost:8080');
export const API_URL = getConfig(import.meta.env.VITE_API_URL, 'http://localhost:8080/api/v1');
export const SOCKET_URL = getConfig(import.meta.env.VITE_SOCKET_URL, 'http://localhost:8080');

// Frontend Configuration (hardcoded in production)
export const FRONTEND_URL = getConfig(import.meta.env.VITE_FRONTEND_URL, 'http://localhost:3000');

// Keycloak Configuration (hardcoded in production)
export const KEYCLOAK_URL = getConfig(import.meta.env.VITE_KEYCLOAK_URL, 'https://auth.ttgteams.com');
export const KEYCLOAK_REALM = getConfig(import.meta.env.VITE_KEYCLOAK_REALM, 'synapse_realm');
export const KEYCLOAK_CLIENT_ID = getConfig(import.meta.env.VITE_KEYCLOAK_CLIENT_ID, 'client_synapse');
