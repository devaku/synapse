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