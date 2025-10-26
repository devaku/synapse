import { prismaDb } from '../../lib/database';
import { createTeamsService } from '../../services/teams-service';

const teamsService = createTeamsService(prismaDb);

export class TeamHandlers {
	/**
	 * Create a new team
	 */
	static async createTeam(params: any, userId: number) {
		try {
			const data: any = {
				name: params.name,
				description: params.description,
				createdBy: userId,
			};

			// Add members if provided
			if (params.memberIds && params.memberIds.length > 0) {
				// Ensure creator is included
				const memberSet = new Set(params.memberIds);
				memberSet.add(userId);

				data.teamsUsersBelongTo = {
					create: Array.from(memberSet).map((id) => ({ userId: id })),
				};
			} else {
				// Just add creator
				data.teamsUsersBelongTo = {
					create: [{ userId }],
				};
			}

			const team = await teamsService.createTeam(data);

			return {
				success: true,
				data: team,
				message: 'Team created successfully',
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message,
				message: 'Failed to create team',
			};
		}
	}

	/**
	 * List all teams
	 */
	static async listTeams(params: any, userId: number) {
		try {
			const teams = await teamsService.readAllTeam();

			return {
				success: true,
				data: teams,
				message: `Found ${teams.length} teams`,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message,
				message: 'Failed to list teams',
			};
		}
	}

	/**
	 * Add team members
	 */
	static async addTeamMember(params: any, userId: number) {
		try {
			const { teamId, userIds } = params;

			// Check if team exists
			const team = await prismaDb.team.findUnique({
				where: { id: teamId },
			});

			if (!team) {
				return {
					success: false,
					message: 'Team not found',
				};
			}

			// Add members
			const addedMembers = await Promise.all(
				userIds.map((memberId: number) =>
					prismaDb.teamsUsersBelongTo.upsert({
						where: {
							userId_teamId: {
								userId: memberId,
								teamId: teamId,
							},
						},
						create: {
							userId: memberId,
							teamId: teamId,
						},
						update: {},
					})
				)
			);

			return {
				success: true,
				data: { teamId, addedMembers: addedMembers.length },
				message: `Added ${addedMembers.length} members to team`,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message,
				message: 'Failed to add team members',
			};
		}
	}

	/**
	 * Remove team members
	 */
	static async removeTeamMember(params: any, userId: number) {
		try {
			const { teamId, userIds } = params;

			// Check if team exists
			const team = await prismaDb.team.findUnique({
				where: { id: teamId },
			});

			if (!team) {
				return {
					success: false,
					message: 'Team not found',
				};
			}

			// Don't allow removing the creator
			const filteredUserIds = userIds.filter(
				(id: number) => id !== team.createdBy
			);

			if (filteredUserIds.length !== userIds.length) {
				console.warn('Attempted to remove team creator, skipping');
			}

			// Remove members
			const result = await prismaDb.teamsUsersBelongTo.deleteMany({
				where: {
					teamId: teamId,
					userId: {
						in: filteredUserIds,
					},
				},
			});

			return {
				success: true,
				data: { teamId, removedMembers: result.count },
				message: `Removed ${result.count} members from team`,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message,
				message: 'Failed to remove team members',
			};
		}
	}
}
