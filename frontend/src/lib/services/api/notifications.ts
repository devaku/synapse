import type { jsonResponse } from '../../types/custom';
import { API_URL } from '../../env-variables';

const url = API_URL;

export async function readAllNotifications(token: string) {
	const response: jsonResponse = await fetch(`${url}/notifications`, {
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
