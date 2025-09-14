import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
	url: 'http://localhost:4000/', // Keycloak server
	realm: 'synapse_realm',
	clientId: 'synapse_client_id',
});
export default keycloak;
