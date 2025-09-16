import Keycloak from 'keycloak-js';
import keycloakConfig from '../../../config/keycloak.json';

const keycloak = new Keycloak({
	url: keycloakConfig.url,
	realm: keycloakConfig.realm,
	clientId: keycloakConfig.clientId,
});
export default keycloak;
