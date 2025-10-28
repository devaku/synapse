import { useState, useEffect } from 'react';
import {
	getTeams,
	createTeam,
	softDeleteTeam,
	editTeam as editTeamAPI,
} from '../../services/api/teams';

import { useAuthContext } from '../../contexts/AuthContext';

export interface Team {
	id: number;
	name: string;
	description?: string;
}

type createTeamData = {
	name: string;
	description?: string;
	users?: number[];
	createdBy: number;
};

export function useTeams() {
	const [teams, setTeams] = useState<Team[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { token } = useAuthContext();

	// Fetch teams on load
	useEffect(() => {
		refreshTeams();
	}, []);

	async function refreshTeams() {
		setLoading(true);
		try {
			const data = await getTeams(token!);
			console.log('Raw API response:', data);

			// Ensure data is an array
			if (Array.isArray(data)) {
				setTeams(data);
			} else if (data && Array.isArray(data.teams)) {
				// Handle case where API returns { teams: [...] }
				setTeams(data.teams);
			} else if (data && Array.isArray(data.data)) {
				// Handle case where API returns { data: [...] }
				setTeams(data.data);
			} else {
				console.warn('API returned non-array data:', data);
				setTeams([]);
			}
		} catch (err: any) {
			setError(err.message || 'Error fetching teams');
			setTeams([]); // Ensure teams is always an array
		} finally {
			setLoading(false);
		}
	}

	async function addTeam(newTeam: Partial<createTeamData>) {
		try {
			const created = await createTeam(token!, newTeam);

			if (created) {
				// Add the new team to the existing list
				setTeams((prev) => {
					const updated = [...prev, created];
					return updated;
				});
			}

			return created;
		} catch (err: any) {
			setError(err.message || 'Error creating team');
			throw err; // Re-throw so the component can handle it
		}
	}

	async function softRemoveTeam(teamIdArray: number[]) {
		setLoading(true);
		try {
			const success = await softDeleteTeam(token!, teamIdArray);
			if (success !== undefined) {
				// softDeleteTeam returns JSON or undefined
				setTeams((prev) =>
					prev.filter((t) => !teamIdArray.includes(t.id))
				);
			}
		} catch (err: any) {
			setError(err.message || 'Error deleting team');
		} finally {
			setLoading(false);
		}
	}

	async function editTeam(updatedTeam: {
		id: number;
		name: string;
		description?: string;
	}) {
		try {
			const edited = await editTeamAPI(token!, updatedTeam);

			if (edited) {
				// Update the team in the existing list
				setTeams((prev) =>
					prev.map((team) =>
						team.id === updatedTeam.id
							? { ...team, ...updatedTeam }
							: team
					)
				);
			}

			return edited;
		} catch (err: any) {
			setError(err.message || 'Error updating team');
			throw err; // Re-throw so the component can handle it
		}
	}

	return {
		teams,
		loading,
		error,
		refreshTeams,
		addTeam,
		softRemoveTeam,
		editTeam,
	};
}
