import { prisma } from '../lib/database';
import { teamType } from '../types';

export async function createTeam(team: teamType){
    const teamRow = await prisma.team.create({
        data: {
            ...team
        },
    })

    return teamRow
}

export async function readAllTeam (){
    const teamrow = await prisma.team.findMany({

		include: {
			createdByUser: {
				select: {
					id: true,
					username: true,
					firstName: true,
					lastName: true,
				},
			}
        }

    })

    return teamrow
}