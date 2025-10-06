import { useState, useEffect, useCallback } from 'react';
import { readAllTasks } from '../../services/api/task';
import { useTeams } from '../../hooks/api/useTeams';
import { useAuthContext } from '../../contexts/AuthContext';

export interface Task {
	id: number;
	priority: string;
	name: string;
	description: string;
	isArchived?: boolean;
	taskVisibleToTeams: {
		teamId: number;
	}[];
}

export interface LeaderboardTeam {
	name: string;
	tasks: number;
}

export function useTeamTasks() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [leaderboardData, setLeaderboardData] = useState<LeaderboardTeam[]>(
		[]
	);
	const { token } = useAuthContext();
	const { teams } = useTeams();

	const parseTeamTasks = useCallback(
		(taskData: Task[]) => {
			const data: Partial<LeaderboardTeam>[] = structuredClone(teams);

			for (const task of taskData) {
				if (!task.isArchived) {
					continue;
				}

				console.log(task.taskVisibleToTeams);
				const teamId = task.taskVisibleToTeams[0].teamId;
				const currentTeam = data[teamId - 1];

				if (!currentTeam.tasks) {
					currentTeam.tasks = 0;
				}

				currentTeam.tasks += 1;
			}

			data.shift(); // Remove the 'Everyone' team
			setLeaderboardData(data as LeaderboardTeam[]);
		},
		[teams]
	);

	const refresh = useCallback(async () => {
		try {
			const data = await readAllTasks(token!);
			console.log('Raw API response:', data);

			if (Array.isArray(data)) {
				parseTeamTasks(data);
				setTasks(data);
			} else {
				console.warn('API returned non-array data:', data);
				setTasks([]);
			}
		} catch (err) {
			if (err instanceof Error) {
				console.log(err.message || 'Error fetching teams');
			}
		}
	}, [token, parseTeamTasks]);

	useEffect(() => {
		refresh();
	}, [refresh]);

	return {
		leaderboardData,
		tasks,
	};
}
