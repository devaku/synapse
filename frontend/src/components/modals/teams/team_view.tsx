import { useState, useEffect } from 'react';
import Spinner from '../../ui/spinner';
import { useAuthContext } from '../../../lib/contexts/AuthContext';
import { getTeams } from '../../../lib/services/api/teams';
import type { User } from '../../../lib/types/models';

interface TeamData {
	id: number;
	name: string;
	description?: string | null;
	createdBy: number;
	createdAt: Date;
	isDeleted: number;
	createdByUser?: {
		id: number;
		username: string;
		firstName?: string;
		lastName?: string;
	};
	teamsUsersBelongTo?: Array<{
		userId: number;
		teamId: number;
		user: User;
	}>;
}

// Displays a modal with detailed information about a selected team.
export default function TeamsViewModal({
	teamId,
	handleModalDisplay,
}: {
	teamId: number;
	handleModalDisplay: () => void;
}) {
	const { token } = useAuthContext();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [teamData, setTeamData] = useState<TeamData | null>(null);

	// Used AI for this section (lines 37–69)
	// Prompt: "Write a React useEffect that fetches a list of teams using a token,
	// finds the one matching a given teamId, handles errors, and updates state.""
	useEffect(() => {
		async function loadTeam() {
			if (!token || !teamId) {
				setIsLoading(false);
				return;
			}

			try {
				const response = await getTeams(token);
				const teamsArray = response.data || response;
				console.log('All teams:', teamsArray);
				console.log('Looking for team with ID:', teamId);

				const team = teamsArray.find((t: TeamData) => t.id === teamId);
				console.log('Found team:', team);
				console.log(
					'Team teamsUsersBelongTo:',
					team?.teamsUsersBelongTo
				);
				console.log('Team createdByUser:', team?.createdByUser);

				if (team) {
					setTeamData(team);
				} else {
					console.warn('Team not found');
				}
			} catch (err) {
				console.error('Error loading team:', err);
			} finally {
				setIsLoading(false);
			}
		}
		loadTeam();
	}, [teamId, token]);

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<div className="flex flex-col gap-4 ml-5 pb-2 pr-2 overflow-y-auto h-screen">
					<div className="pt-2">
						<p className="text-2xl font-bold">Team Details</p>
					</div>

					{teamData && (
						<div className="flex flex-col gap-4">
							<div>
								<p className="font-bold">Team Name:</p>
								<p className="text-lg">{teamData.name}</p>
							</div>

							<div>
								<p className="font-bold">Description:</p>
								<p className="text-lg">
									{teamData.description || 'No description'}
								</p>
							</div>

							<div>
								<p className="font-bold">Created By:</p>
								<p className="text-lg">
									{teamData.createdByUser?.username}
								</p>
							</div>

							<div>
								<p className="font-bold">Team Members:</p>
								{teamData.teamsUsersBelongTo &&
								teamData.teamsUsersBelongTo.length > 0 ? (
									<ul className="list-disc list-inside mt-2">
										{teamData.teamsUsersBelongTo.map(
											(membership) => (
												<li
													key={membership.user.id}
													className="text-lg"
												>
													{membership.user.username}
												</li>
											)
										)}
									</ul>
								) : (
									<p className="text-lg text-gray-500">
										No members assigned
									</p>
								)}
							</div>
						</div>
					)}

					<button
						onClick={() => handleModalDisplay()}
						className="mt-4 py-2 w-full bg-[#153243] text-white rounded cursor-pointer"
					>
						BACK
					</button>
				</div>
			)}
		</>
	);
}
