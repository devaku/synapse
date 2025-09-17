import { type jsonResponse, type taskType } from '../../types';
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

	let { data } = response;
	if (data) {
		return data;
	} else {
		return [];
	}
}

export async function deleteTask(id: number) {
	let response: jsonResponse = await fetch(`${url}/tasks/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: 'Bearer TOKEN',
		},
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
