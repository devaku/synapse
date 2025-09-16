import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
	url: 'http://localhost:4000/', // Keycloak server
	realm: 'synapse_realm',
	clientId: 'client_synapse',
});
export default keycloak;
