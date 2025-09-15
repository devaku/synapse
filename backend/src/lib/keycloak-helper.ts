import axios from 'axios';
import url from 'url';

import {
	KEYCLOAK_CLIENT_ID,
	KEYCLOAK_CLIENT_REALM,
	KEYCLOAK_CLIENT_SECRET,
	KEYCLOAK_URL,
} from './env-variables';

export async function getKeycloakToken() {
	try {
		// const formData = new FormData();

		// formData.append('realm', 'synapse_realm');
		// formData.append('client_id', 'synapse_backend_id');
		// formData.append('client_secret', 'K0i2rkXEBlJU6U8eXTqCvlCghZHswIN6');
		// formData.append('grant_type', 'client_credentials');

		const params = new url.URLSearchParams({
			realm: 'synapse_realm',
			client_id: 'synapse_backend_id',
			client_secret: 'K0i2rkXEBlJU6U8eXTqCvlCghZHswIN6',
			grant_type: 'client_credentials',
		});

		let response = await axios({
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			method: 'POST',
			url: `http://localhost:4000/realms/synapse_realm/protocol/openid-connect/token`,
			data: params.toString(),
		})
			.then((res) => res.data)
			.catch((e) => {
				// console.log(e.response.data);
				// console.log(e);
			});

		return response;
	} catch (e: any) {}
}

export async function createKeycloakUser(token: string) {
	try {
		const axiosData = {
			username: 'user2',
			email: 'user2@email.com',
			emailVerified: true,
			enabled: true,
			credentials: [
				{
					type: 'password',
					value: 'user2',
					temporary: false,
				},
			],
		};

		let response = await axios({
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			method: 'POST',
			url: `http://localhost:4000/admin/realms/synapse_realm/users`,
			data: JSON.stringify(axiosData),
		})
			.then((res) => {
				console.log(res);
			})
			.catch((e) => {
				console.log('ERROR IN CREATING USER');
				console.log(e.response.data);
				// console.log(e);
			});

		return response;
	} catch (error: any) {}
}
