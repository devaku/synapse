import { Request, Response } from 'express';
import * as userService from '../services/user-service';
import { buildResponse, buildError } from '../lib/response-helper';

// READ
export async function readAllUsers(req: Request, res: Response) {
	try {
		let rowData;
		let message = '';

		rowData = await userService.readAllUsers();
		message =
			rowData.length > 0
				? 'Data retrieved successfully.'
				: 'No data found.';

		return res.status(200).json(buildResponse(200, message, rowData));
	} catch (error: any) {
		console.error('Error:', error);
		return res
			.status(500)
			.json(buildError(500, 'Error retrieving users', error));
	}
}

export async function readUserByKeycloakId(req: Request, res: Response) {
	try {
		let keycloakId = req.params.id;

		let message = '';
		let rowData = await userService.readUserByKeycloakId(keycloakId);

		if (rowData) {
			message = 'Data retrieved successfully.';
		} else {
			message = 'No data found';
		}

		return res.status(200).json(buildResponse(200, message, rowData));
	} catch (error: any) {
		console.error('Error:', error);
		return res
			.status(500)
			.json(buildError(500, 'Error retrieving tasks', error));
	}
}
