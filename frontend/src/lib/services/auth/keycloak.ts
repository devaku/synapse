import Keycloak from 'keycloak-js';
import keycloakConfig from '../../../config/keycloak.json';

const keycloak = new Keycloak({
	url: import.meta.env.VITE_KEYCLOAK_URL,
	realm: import.meta.env.VITE_KEYCLOAK_REALM,
	clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});
export default keycloak;
