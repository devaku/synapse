import { Request, Response } from 'express';
import * as subscriptionService from '../services/task-subscription-service';
import { buildResponse, buildError } from '../lib/helpers/response-helper';
import { prismaDb } from '../lib/database';

/**
 * Subscribe to a task
 */
export async function subscribe(req: Request, res: Response) {
	try {
		// Get the logged-in user's ID from the session
		const userId = req.session.userData?.user.id;
		const taskId = parseInt(req.params.id);

		if (!userId) {
			return res
				.status(401)
				.json(buildError(401, 'Unauthorized - No valid session', null));
		} // Idk if we need validation for this

		if (!taskId || isNaN(taskId)) {
			return res
				.status(400)
				.json(buildError(400, 'Invalid task ID', null));
		} // Validation will be needed...

		// Check if this user is already subscribed to this task
		// AI helped me generate lines 26-39, prompt was: "check if a subscription already exists in prisma before creating a new one to avoid duplicate key errors"
		const existingSubscription =
			await prismaDb.taskUserSubscribeTo.findUnique({
				where: {
					userId_taskId: {
						userId,
						taskId,
					},
				},
			});

		if (existingSubscription) {
			return res
				.status(409)
				.json(
					buildError(
						409,
						'User is already subscribed to this task',
						null
					)
				);
		}

		await subscriptionService.subscribeToTask(userId, taskId);

		return res
			.status(200)
			.json(
				buildResponse(
					200,
					'User subscribed to task successfully.',
					null
				)
			);
	} catch (error: any) {
		console.error('SUBSCRIBE ERROR:', error);
		return res
			.status(500)
			.json(
				buildError(
					500,
					'Error subscribing to task',
					error.message || 'Unknown error'
				)
			);
	}
}

/**
 * Unsubscribe from a task
 */
export async function unsubscribe(req: Request, res: Response) {
	try {
		const userId = req.session.userData?.user.id;
		const taskId = parseInt(req.params.id);

		if (!userId) {
			return res.status(401).json(buildError(401, 'Unauthorized', null));
		}

		if (!taskId || isNaN(taskId)) {
			return res
				.status(400)
				.json(buildError(400, 'Invalid task ID', null));
		}

		// Delete the subscription from the database
		const unsub = await subscriptionService.unsubscribeFromTask(
			userId,
			taskId
		);
		return res
			.status(200)
			.json(buildResponse(200, 'Unsubscribed from task', unsub));
	} catch (error: any) {
		console.error('UNSUBSCRIBE ERROR:', error);

		// Handle the case where they try to unsubscribe from something they weren't subscribed to
		if (error.code === 'P2025') {
			return res
				.status(404)
				.json(buildError(404, 'Subscription not found', null));
		}
		return res
			.status(500)
			.json(
				buildError(
					500,
					'Error unsubscribing from task',
					error.message || 'Unknown error'
				)
			);
	}
}

/**
 * Get all tasks that the current user is subscribed to
 * Returns list of task objects
 */
export async function listSubscribedTasks(req: Request, res: Response) {
	try {
		const userId = req.session.userData?.user.id;

		if (!userId) {
			return res.status(401).json(buildError(401, 'Unauthorized', null));
		}

		// Fetch all tasks this user is subscribed to from the database
		const tasks = await subscriptionService.getSubscribedTasks(userId);
		return res
			.status(200)
			.json(buildResponse(200, 'Subscribed tasks retrieved', tasks));
	} catch (error: any) {
		console.error('LIST SUBSCRIPTIONS ERROR:', error);
		return res
			.status(500)
			.json(
				buildError(
					500,
					'Error retrieving subscribed tasks',
					error.message || 'Unknown error'
				)
			);
	}
}
