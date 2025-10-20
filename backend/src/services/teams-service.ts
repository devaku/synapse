import { prismaDb } from '../lib/database';
import { teamType } from '../types';

/**
 * Creates a team in the team table with optional users
 * @param team : teamType with optional users array
 * @returns teamrow with members included
 */
export async function createTeam(team: any) {
	const { users, ...teamData } = team;

	const teamRow = await prismaDb.team.create({
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
}

/**
 * Reads all rows in the team table with all related data
 * @returns array of teams with members and creator
 */
export async function readAllTeam() {
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
}

/**
 * Soft deletes a row in the team table
 * @param id - team id
 * @returns soft deleted team row
 */
export async function softDeleteTeam(id: number) {
	const teamRow = await prismaDb.team.update({
		where: {
			id,
		},
		data: {
			isDeleted: 1,
		},
	});
	return teamRow;
}

/**
 * Permanently deletes a row in the team table
 * @param id - team id
 * @returns deleted team row
 */
export async function deleteTeam(id: number) {
	const teamRow = await prismaDb.team.delete({
		where: {
			id,
		},
	});

	return teamRow;
}

/**
 * Updates a team and its members
 * @param id - team id
 * @param team - team object with optional users array
 * @returns updated team with members included
 */
export async function updateTeam(id: number, team: any) {
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
}
