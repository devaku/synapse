import type { jsonResponse } from '../../types/custom';
import { API_URL } from '../../env-variables';

const url = API_URL;

export async function createTask(token: string, taskObj: FormData) {
	// Attach the data to the form
	let response: jsonResponse = await fetch(`${url}/tasks`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		credentials: 'include',
		body: taskObj,
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

export async function updateTask(
	token: string,
	taskId: number,
	taskObj: FormData
) {
	let response: jsonResponse = await fetch(`${url}/tasks/${taskId}`, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		credentials: 'include',
		body: taskObj,
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

export async function readAllTasks(token: string) {
	let response: jsonResponse = await fetch(`${url}/tasks`, {
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

export async function subscribeToTask(token: string, taskId: number) {
	let response: jsonResponse = await fetch(
		`${url}/tasks/subscribe/${taskId}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			credentials: 'include',
			body: JSON.stringify({}),
		}
	)
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

export async function unsubscribeToTask(token: string, taskId: number) {
	let response: jsonResponse = await fetch(
		`${url}/tasks/unsubscribe/${taskId}`,
		{
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			credentials: 'include',
		}
	)
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

export async function deleteTask(token: string, taskIdArray: number[]) {
	let body = {
		taskIdArray,
	};
	let response: jsonResponse = await fetch(`${url}/tasks`, {
		method: 'DELETE',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(body),
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