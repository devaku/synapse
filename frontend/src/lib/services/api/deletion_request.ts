import type { jsonResponse } from '../../types/custom';
import { API_URL } from '../../env-variables';

const url = API_URL;

export async function createDeletionRequest(
	token: string,
	taskId: number,
	reason: string
) {
	let data = {
		taskId,
		reason,
	};

	let response: jsonResponse = await fetch(`${url}/deletion-request`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		},
		credentials: 'include',
		body: JSON.stringify(data),
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
