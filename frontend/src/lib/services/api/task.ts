import type { jsonResponse } from '../../types/custom';
const url = import.meta.env.VITE_API_URL;

export async function createTask(token: string, taskObj: any) {
	let response: jsonResponse = await fetch(`${url}/tasks`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		},
		credentials: 'include',
		body: JSON.stringify(taskObj),
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

export async function updateTask(token: string, taskId: number, taskObj: any) {
	let response: jsonResponse = await fetch(`${url}/tasks/${taskId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		},
		credentials: 'include',
		body: JSON.stringify(taskObj),
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

export async function readTasksFilteredForUser(token: string) {
	let response: jsonResponse = await fetch(`${url}/tasks?useronly=1`, {
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
 * Get a specific task
 */
export async function readTask(token: string, taskId: number) {
	let response: jsonResponse = await fetch(`${url}/tasks/${taskId}`, {
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

export async function archiveTask(token: string, taskId: number) {
	let data = {
		isArchived: 1,
		completeDate: new Date(),
	};

	let response: jsonResponse = await fetch(`${url}/tasks/archive/${taskId}`, {
		method: 'PUT',
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

/**
 * Get all tasks the given user
 * is subscribed to
 * @returns
 */
export async function readAllMyTasks(token: string) {
	let response: jsonResponse = await fetch(`${url}/tasks/subscribed`, {
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
