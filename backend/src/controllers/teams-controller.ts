import { Request, Response } from 'express';
import * as teamsService from '../services/teams-service';
import { buildResponse, buildError } from '../lib/helpers/response-helper';

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
		const teams = await teamsService.readAllTeam();
		let message = '';

		if (teams.length > 0) {
			message = 'Data was retrieved successfully.';
		} else {
			message = 'Table is empty';
		}

		let finalResponse = buildResponse(200, message, teams);
		res.status(200).json(finalResponse);
	} catch (error) {
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

		let deletedTeams = [];
		for (let x = 0; x < teamIdArray.length; x++) {
			const teamId = teamIdArray[x];
			const team = await teamsService.softDeleteTeam(teamId);
			deletedTeams.push(team);
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
		const teamIdArray = req.body.teamIdArray;

		let deletedTeams = [];
		for (let x = 0; x < teamIdArray.length; x++) {
			const teamId = teamIdArray[x];
			const team = await teamsService.deleteTeam(teamId);
			deletedTeams.push(team);
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
