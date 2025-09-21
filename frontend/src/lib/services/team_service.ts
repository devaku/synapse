const url = import.meta.env.VITE_DJANGO_BACKEND_URL;

export async function CreateTeam(name: string, description: string) {
	const data = {
		name,
		description,
	};
	let response = await fetch(`${url}/teams/`, {
		method: 'POST',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then((res) => res.json())
		.catch((error) => {
			console.error('Fetch error:', error);
		});

	return response;
}

/**
 * Get all the Teams
 * @returns array of objects
 */
export async function ReadAllTeams() {
	/**
     * 
[
    {
        "id": 2,
        "name": "UPDATED TEAM",
        "description": "NEW TEAM DESC"
    }
]
     */
	try {
		let response = await fetch(`${url}/teams/`, {
			method: 'GET',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.catch((error) => {
				console.error('Fetch error:', error);
			});

		return response;
	} catch (error) {}
}

export async function ReadTeam(teamId: number) {}

export async function UpdateTeam(teamId: number) {}

export async function DeleteTeam(teamId: number) {
	await fetch(`${url}/api/teams/${teamId}/`, {
		method: 'DELETE',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
	}).catch((error) => {
		console.error('Fetch error:', error);
	});
}
