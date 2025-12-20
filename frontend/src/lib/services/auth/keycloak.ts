import Keycloak from 'keycloak-js';
import keycloakConfig from '../../../config/keycloak.json';
import { KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID } from '../../env-variables';

const keycloak = new Keycloak({
	url: KEYCLOAK_URL,
	realm: KEYCLOAK_REALM,
	clientId: KEYCLOAK_CLIENT_ID,
});
export default keycloak;
