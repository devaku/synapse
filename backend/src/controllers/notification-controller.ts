import { Request, Response } from 'express';
import { createNotificationService } from '../services/notification-service';
import { buildResponse, buildError } from '../lib/helpers/response-helper';
import { prismaDb, txtimeoutValue } from '../lib/database';

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
export async function readAllNotifications(req: Request, res: Response) {
	const notificationService = createNotificationService(prismaDb);
	try {
		const userId = req.session.userData?.user.id!;
		const notifications =
			await notificationService.readAllNotifications(userId);
		let message = '';

		if (notifications.length > 0) {
			message = 'Data was retrieved successfully.';
		} else {
			message = 'Table is empty';
		}

		let finalResponse = buildResponse(200, message, notifications);
		return res.status(200).json(finalResponse);
	} catch (error) {
		let finalResponse = buildError(500, 'There was an error', error);
		res.status(500).json(finalResponse);
	}
}
