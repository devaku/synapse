import { Request, Response } from 'express';
import { buildResponse, buildError } from '../lib/helpers/response-helper';
import { createTeamsService } from '../services/teams-service';
import { createUserService } from '../services/user-service';
import { prismaDb } from '../lib/database';

const teamsService = createTeamsService(prismaDb);

/**
 * Controller to create a team in the database
 *
 * @param req - Request object containing a team object with optional users array
 * @param res - Response Object
 *
 * @returns A JSON response with the HTTP 201 message and created team with members
 *
 * @throws Responds with a 500 status code and error details if an exception occurs.
 */
export async function createTeam(req: Request, res: Response) {
	try {
		let data = req.body;
		const team = await teamsService.createTeam(data);

		let finalResponse = buildResponse(
			201,
			'Team was created successfully!',
			team
		);

		res.status(201).json(finalResponse);
	} catch (error: any) {
		let finalResponse = buildError(
			500,
			'There was an error creating the team',
			error
		);
		res.status(500).json(finalResponse);
	}
}

/**
 * Controller to read all teams in the database
 *
 * @param req - Request object
 * @param res - Response Object
 *
 * @returns A JSON response with the HTTP 200 message and all teams with members
 *
 * @throws Responds with a 500 status code and error details if an exception occurs.
 */
export async function readAllTeams(req: Request, res: Response) {
	try {
		const userRoles = req.session.userData?.roles || [];
		const isAdmin = userRoles.includes('admins');
		const userId = req.session.userData?.user.id;

		let teams: any[] = [];
		let message = '';

		if (isAdmin) {
			// Admins can view all teams
			teams = await teamsService.readAllTeam();
			message = teams.length > 0 
				? 'Data was retrieved successfully.' 
				: 'Table is empty';
		} else {
			// Non-admins can only view teams they belong to
			if (!userId) {
				return res
					.status(401)
					.json(buildError(401, 'Unauthorized', null));
			}

			// Get user's teams
			const userService = createUserService(prismaDb);
			const user = await userService.readUser(userId);
			
			if (!user || !user.teamsUsersBelongTo || user.teamsUsersBelongTo.length === 0) {
				teams = [];
				message = 'No teams found for this user.';
			} else {
				// Get full team details for each team the user belongs to
				const teamIds = user.teamsUsersBelongTo.map((t: any) => t.teamId);
				const fetchedTeams = await Promise.all(
					teamIds.map((teamId: number) => teamsService.readTeam(teamId))
				);
				// Filter out any null results (in case team was deleted)
				teams = fetchedTeams.filter((team: any) => team !== null && team.isDeleted === 0);
				message = teams.length > 0
					? 'Data was retrieved successfully.'
					: 'No teams found for this user.';
			}
		}

		let finalResponse = buildResponse(200, message, teams);
		res.status(200).json(finalResponse);
	} catch (error) {
		console.error('READ ALL TEAMS ERROR:', error);
		let finalResponse = buildError(500, 'There was an error', error);
		res.status(500).json(finalResponse);
	}
}

/**
 * Controller to bulk soft delete function for the team object
 *
 * @param req - Request object containing teamIdArray in its body
 * @param res - Response Object
 *
 * @returns A JSON response with the HTTP 200 message and the amount of rows deleted
 *
 * @throws Responds with a 500 status code and error details if an exception occurs.
 */
export async function softDeleteTeam(req: Request, res: Response) {
	try {
		const teamIdArray = req.body.teamIdArray;
		const userId = req.session.userData?.user.id;
		const userRoles = req.session.userData?.roles || [];
		const isAdmin = userRoles.includes('admins');

		if (!teamIdArray || !Array.isArray(teamIdArray) || teamIdArray.length === 0) {
			return res
				.status(400)
				.json(buildError(400, 'teamIdArray is required and must be a non-empty array', null));
		}

		let deletedTeams = [];
		for (let x = 0; x < teamIdArray.length; x++) {
			const teamId = teamIdArray[x];
			
			// SECURITY: Check if user is the team creator or an admin
			const existingTeam = await teamsService.readTeam(teamId);
			if (!existingTeam) {
				continue; // Skip if team doesn't exist
			}

			const isCreator = existingTeam.createdBy === userId;
			if (!isAdmin && !isCreator) {
				continue; // Skip if user doesn't have permission
			}

			const team = await teamsService.softDeleteTeam(teamId);
			deletedTeams.push(team);
		}

		if (deletedTeams.length === 0) {
			return res
				.status(403)
				.json(buildError(403, 'Forbidden: No teams were deleted. Check permissions.', null));
		}

		let message = `${deletedTeams.length} team(s) soft deleted successfully.`;

		let finalResponse = buildResponse(200, message, deletedTeams);

		res.status(200).json(finalResponse);
	} catch (error) {
		let finalResponse = buildError(500, 'There was an error', error);
		res.status(500).json(finalResponse);
	}
}

/**
 * Controller to permanently delete teams
 *
 * @param req - Request object containing teamIdArray in its body
 * @param res - Response Object
 *
 * @returns A JSON response with the HTTP 200 message and the amount of rows deleted
 *
 * @throws Responds with a 500 status code and error details if an exception occurs.
 */
export async function deleteTeam(req: Request, res: Response) {
	try {
		// SECURITY: Only admins can permanently delete teams
		const userRoles = req.session.userData?.roles || [];
		if (!userRoles.includes('admins')) {
			return res
				.status(403)
				.json(buildError(403, 'Forbidden: Only admins can permanently delete teams', null));
		}

		const teamIdArray = req.body.teamIdArray;

		if (!teamIdArray || !Array.isArray(teamIdArray) || teamIdArray.length === 0) {
			return res
				.status(400)
				.json(buildError(400, 'teamIdArray is required and must be a non-empty array', null));
		}

		let deletedTeams = [];
		for (let x = 0; x < teamIdArray.length; x++) {
			const teamId = teamIdArray[x];
			try {
				const team = await teamsService.deleteTeam(teamId);
				deletedTeams.push(team);
			} catch (error) {
				// Skip if team doesn't exist or other error
				continue;
			}
		}

		if (deletedTeams.length === 0) {
			return res
				.status(400)
				.json(buildError(400, 'No teams were deleted. Check if team IDs are valid.', null));
		}

		let message = `${deletedTeams.length} team(s) permanently deleted successfully.`;

		let finalResponse = buildResponse(200, message, deletedTeams);

		res.status(200).json(finalResponse);
	} catch (error) {
		let finalResponse = buildError(500, 'There was an error', error);
		res.status(500).json(finalResponse);
	}
}

/**
 * Controller to update a team and its members
 *
 * @param req - Request object containing team object with optional users array
 * @param res - Response Object
 *
 * @returns A JSON response with the HTTP 200 message and updated team with members
 *
 * @throws Responds with a 500 status code and error details if an exception occurs.
 */
export async function updateTeam(req: Request, res: Response) {
	try {
		const team = req.body;
		const userId = req.session.userData?.user.id;
		
		// SECURITY: Check if user is the team creator or an admin
		const existingTeam = await teamsService.readTeam(team.id);
		if (!existingTeam) {
			return res
				.status(404)
				.json(buildError(404, 'Team not found', null));
		}

		const userRoles = req.session.userData?.roles || [];
		const isAdmin = userRoles.includes('admins');
		const isCreator = existingTeam.createdBy === userId;

		if (!isAdmin && !isCreator) {
			return res
				.status(403)
				.json(buildError(403, 'Forbidden: Only team creator or admins can update teams', null));
		}

		const updatedTeam = await teamsService.updateTeam(team.id, team);

		let finalResponse = buildResponse(
			200,
			'Team was updated successfully!',
			updatedTeam
		);
		res.status(200).json(finalResponse);
	} catch (error) {
		let finalResponse = buildError(
			500,
			'There was an error updating the team',
			error
		);
		res.status(500).json(finalResponse);
	}
}
