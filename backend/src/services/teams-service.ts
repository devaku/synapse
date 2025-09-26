import { prisma } from '../lib/database';
import { teamType } from '../types';

/**
 * Creates a team in the team table 
 * @param team : teamType
 * @returns teamrow
 */
export async function createTeam(team: teamType){
    const teamRow = await prisma.team.create({
        data: {
            ...team
        },
    })

    return teamRow
}

/**
 * Reads all rows in the team table
 * @param 
 * @returns teamrow
 */
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

/**
 * Soft deletes a row in the team table, should be verified by an admin user to confirm deletion
 * @param id
 * @returns
 */
export async function softDeleteTeam(id: number) {
	const teamRow = await prisma.team.update({
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
 * Deletes a row in the team table, should be used after admin verification
 * @param id
 * @returns
 */
export async function deleteTeam(id: number) {

    const teamRow = await prisma.team.delete({
        where: {
            id,
        },
    })

    return teamRow;


}

/**
 * Service to fully update an individual team in the teams table 
 * @param id
 * @param team an object of type teamType
 * @returns
 */
export async function updateTeam(id: number, team: teamType) {

	const teamRow = await prisma.team.update({

		where: {
			id: id,
		},
		data:{
			...team,
		},
	})

	return teamRow;

}