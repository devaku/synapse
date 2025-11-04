const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Fetch all teams
 */
export async function getTeams(token: string) {
	try {
		const res = await fetch(`${BASE_URL}/teams/`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'same-origin',
		});

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		const data = await res.json();
		console.log('getTeams API response:', data);
		return data;
	} catch (error) {
		console.error('Fetch error:', error);
		throw error;
	}
}

type createTeamData = {
	name: string;
	description?: string;
	users?: number[];
	createdBy: number;
};

/**
 * Create a new team
 */
export async function createTeam(token: string, data: Partial<createTeamData>) {
	try {
		const res = await fetch(`${BASE_URL}/teams/`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'same-origin',
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		const result = await res.json();
		console.log('createTeam API response:', result);
		return result;
	} catch (error) {
		console.error('Fetch error:', error);
		throw error;
	}
}

/**
 * Delete a team by ID
 */
export async function softDeleteTeam(token: string, teamIdArray: number[]) {
	let body = {
		teamIdArray,
	};
	try {
		const res = await fetch(`${BASE_URL}/teams/soft-delete/`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'same-origin',
			body: JSON.stringify(body),
		});
		return await res.json();
	} catch (error) {
		console.error('Fetch error:', error);
		throw error;
	}
}

/**
 * Edit an existing team
 */
export async function editTeam(
	token: string,
	data: {
		id: number;
		name: string;
		description?: string;
		users?: number[];
	}
) {
	try {
		const res = await fetch(`${BASE_URL}/teams/`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			credentials: 'same-origin',
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		const result = await res.json();
		console.log('editTeam API response:', result);
		return result;
	} catch (error) {
		console.error('Fetch error:', error);
		throw error;
	}
}
// Mock
// let mockTeams = [
//   { id: 1, name: 'Mock Team 1', description: 'This is a mock team' },
//   { id: 2, name: 'Mock Team 2', description: 'This is a mock team' },
// ];

// /**
//  * Fetch all teams
//  */
// export async function getTeams() {
//   // Simulate network delay
//   await new Promise((res) => setTimeout(res, 300));
//   return mockTeams;
// }

// /**
//  * Create a new team
//  */
// export async function createTeam(data: { name: string }) {
//   await new Promise((res) => setTimeout(res, 300));
//   const newTeam = { id: Date.now(), ...data };
//   mockTeams.push(newTeam);
//   return newTeam;
// }

// /**
//  * Delete a team by ID
//  */
// export async function deleteTeam(id: number | string) {
//   await new Promise((res) => setTimeout(res, 300));
//   mockTeams = mockTeams.filter((t) => t.id !== id);
//   return { success: true };
// }
