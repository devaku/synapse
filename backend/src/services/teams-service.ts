import { prismaDb } from '../lib/database';
import { teamType } from '../types';

export async function createTeam(team: teamType) {
	const teamRow = await prismaDb.team.create({
		data: {
			...team,
		},
	});

	return teamRow;
}

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
		},
	});

	return teamrow;
}
