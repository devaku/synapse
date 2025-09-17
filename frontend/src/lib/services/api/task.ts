import { type jsonResponse } from '../../types';
const url = import.meta.env.VITE_API_URL;

export async function readAllTasks() {
	let response: jsonResponse = await fetch(`${url}/tasks`, {
		method: 'GET',
		credentials: 'include',
	})
		.then((res) => res.json())
		.catch((error) => {
			console.error('Fetch error:', error);
		});

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

export async function deleteTask(taskIdArray: number[]) {
	let body = {
		taskIdArray,
	};
	let response: jsonResponse = await fetch(`${url}/tasks`, {
		method: 'DELETE',
		headers: {
			'Authorization': 'Bearer TOKEN',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})
		.then((res) => res.json())
		.catch((error) => {
			console.error('Fetch error:', error);
		});

	let { data } = response;
	if (data) {
		return data;
	} else {
		return [];
	}
}
