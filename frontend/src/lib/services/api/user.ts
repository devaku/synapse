import type { jsonResponse } from '../../types/custom';
import { API_URL } from '../../env-variables';

const url = API_URL;

export async function readAllUsers(token: string) {
	let response: jsonResponse = await fetch(`${url}/users`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		credentials: 'include',
	})
		.then((res) => res.json())
		.catch((error) => {
			console.error('Fetch error:', error);
		});

	if (response.statusCode == 401) {
		throw new Error(response.data![0].error);
	}

	if (response) {
		if (response.data) {
			return response.data;
		} else {
			return [];
		}
	} else {
		return [];
	}
}

/**
 * Get a specific user
 */
export async function readUser(token: string, keycloakId: string) {
	let response: jsonResponse = await fetch(`${url}/users/${keycloakId}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		credentials: 'include',
	})
		.then((res) => res.json())
		.catch((error) => {
			console.error('Fetch error:', error);
		});

	if (response.statusCode == 401) {
		throw new Error(response.data![0].error);
	}

	if (response) {
		if (response.data) {
			return response.data;
		} else {
			return [];
		}
	} else {
		return [];
	}
}
