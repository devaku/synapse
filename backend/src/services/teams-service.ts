import { prismaDb } from '../lib/database';
import { PrismaClientOrTransaction } from '../types';

export const createTeamsService = (tx: PrismaClientOrTransaction) => {
	return {
		/**
		 * Creates a team in the team table with optional users
		 * @param team : teamType with optional users array
		 * @returns teamrow with members included
		 */
		createTeam: async function createTeam(team: any) {
			const { users, ...teamData } = team;

			const teamRow = await tx.team.create({
				data: {
					...teamData,
					teamsUsersBelongTo:
						users && users.length > 0
							? {
									create: users.map((userId: number) => ({
										userId: userId,
									})),
							  }
							: undefined,
				},
				include: {
					createdByUser: {
						select: {
							id: true,
							username: true,
							firstName: true,
							lastName: true,
						},
					},
					teamsUsersBelongTo: {
						include: {
							user: {
								select: {
									id: true,
									username: true,
									firstName: true,
									lastName: true,
									email: true,
								},
							},
						},
					},
				},
			});

			return teamRow;
		},

		readTeam: async function readTeam(id: number) {
			const teamrow = await prismaDb.team.findFirst({
				where: {
					id,
				},
				include: {
					createdByUser: {
						select: {
							id: true,
							username: true,
							firstName: true,
							lastName: true,
						},
					},
					teamsUsersBelongTo: {
						include: {
							user: {
								select: {
									id: true,
									username: true,
									firstName: true,
									lastName: true,
									email: true,
								},
							},
						},
					},
				},
			});

			return teamrow;
		},

		/**
		 * Reads all rows in the team table with all related data
		 * @returns array of teams with members and creator
		 */
		readAllTeam: async function readAllTeam() {
			const teamrow = await prismaDb.team.findMany({
				include: {
					createdByUser: {
						select: {
							id: true,
							username: true,
							firstName: true,
							lastName: true,
						},
					},
					teamsUsersBelongTo: {
						include: {
							user: {
								select: {
									id: true,
									username: true,
									firstName: true,
									lastName: true,
									email: true,
								},
							},
						},
					},
				},
			});

			return teamrow;
		},

		/**
		 * Updates a team and its members
		 * @param id - team id
		 * @param team - team object with optional users array
		 * @returns updated team with members included
		 */

		updateTeam: async function updateTeam(id: number, team: any) {
			const { users, ...teamData } = team;

			// If users array is provided, update the team members
			if (users && Array.isArray(users)) {
				// Delete all existing team memberships
				await prismaDb.teamsUsersBelongTo.deleteMany({
					where: {
						teamId: id,
					},
				});

				// Create new team memberships
				if (users.length > 0) {
					await prismaDb.teamsUsersBelongTo.createMany({
						data: users.map((userId: number) => ({
							userId: userId,
							teamId: id,
						})),
					});
				}
			}

			// Update the team
			const teamRow = await prismaDb.team.update({
				where: {
					id: id,
				},
				data: {
					...teamData,
				},
				include: {
					createdByUser: {
						select: {
							id: true,
							username: true,
							firstName: true,
							lastName: true,
						},
					},
					teamsUsersBelongTo: {
						include: {
							user: {
								select: {
									id: true,
									username: true,
									firstName: true,
									lastName: true,
									email: true,
								},
							},
						},
					},
				},
			});

			return teamRow;
		},

		/**
		 * Soft deletes a row in the team table
		 * @param id - team id
		 * @returns soft deleted team row
		 */
		softDeleteTeam: async function softDeleteTeam(id: number) {
			const teamRow = await prismaDb.team.update({
				where: {
					id,
				},
				data: {
					isDeleted: 1,
				},
			});
			return teamRow;
		},

		/**
		 * Permanently deletes a row in the team table
		 * @param id - team id
		 * @returns deleted team row
		 */
		deleteTeam: async function deleteTeam(id: number) {
			const teamRow = await prismaDb.team.delete({
				where: {
					id,
				},
			});

			return teamRow;
		},
	};
};
