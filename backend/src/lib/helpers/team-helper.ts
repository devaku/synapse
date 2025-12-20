import { prismaDb } from '../database';
import { createTeamsService } from '../../services/teams-service';

export async function readTeamMembers(teamIds: number[]) {
	const teamsService = createTeamsService(prismaDb);

	// If 'everyone' is tag, don't bother querying
	if (teamIds.includes(1)) {
		const team = await teamsService.readTeam(1);

		// RETURNE EVERYONE lol
		return team?.teamsUsersBelongTo.map((el) => el.userId);
	} else {
		const userIds: any = [];
		for (let index = 0; index < teamIds.length; index++) {
			const element = teamIds[index];
			const team = await teamsService.readTeam(element);
			let ids = team?.teamsUsersBelongTo.map((el) => el.userId);
			if (ids && ids.length > 0) {
				userIds.push(...ids);
			}
		}

		return userIds;
	}
}
