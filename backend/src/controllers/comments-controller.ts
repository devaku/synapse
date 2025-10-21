import { prismaDb } from '../lib/database';
import { Request, Response } from 'express';
import { IMAGE_STORAGE_URL } from '../lib/env-variables';
import { Server as SocketIOServer } from 'socket.io';

/**
 * TYPES
 */
import { PrismaClientOrTransaction } from '../types';
import { Notification, User } from '../../database/generated/prisma';
import { PAYLOAD_ACTIONS } from '../lib/socket-events';

/**
 * SERVICES
 */
import { createImageService } from '../services/images-service';
import { createCommentService } from '../services/comments-service';
import { createImageLinkService } from '../services/image-link-service';
import { createTaskService } from '../services/task-service';
import { createNotificationForUsersService } from '../services/link_tables/notification-for-users-service';
import { createNotificationService } from '../services/notification-service';
import { createTaskSubscriptionService } from '../services/task-subscription-service';

/**
 * HELPERS
 */
import { buildResponse, buildError } from '../lib/helpers/response-helper';
import { deleteUploadedFiles } from '../lib/file-helper';
import { pingUsersOfNewCommentOnTask } from '../lib/helpers/socket-helper';

const commentService = createCommentService(prismaDb);
const taskService = createTaskService(prismaDb);
const notificationService = createNotificationService(prismaDb);
const notificationForUsersService = createNotificationForUsersService(prismaDb);
const taskSubscriptionService = createTaskSubscriptionService(prismaDb);

/**
 * This entire endpoint is atomic
 */
export async function createComment(req: Request, res: Response) {
	let { message, taskId } = req.body;
	taskId = Number(taskId);
	const userId = req.session.userData?.user.id;

	await prismaDb.$transaction(async (tx: PrismaClientOrTransaction) => {
		// Load up the service
		const imageService = createImageService(tx);
		const imageLinkService = createImageLinkService(tx);

		try {
			// req.files[0].filename
			// console.log(req.files);

			// Create the comment in the database
			const commentRow = await commentService.createComment(
				userId!,
				taskId,
				message
			);

			// If there were images uploaded
			// store them to database
			let imageRows;
			if (Array.isArray(req.files)) {
				const uploaded = req.files;
				if (uploaded.length > 0) {
					const images = uploaded.map((el: any) => {
						return `${IMAGE_STORAGE_URL}/${el.filename}`;
					});
					imageRows = await imageService.createImage(userId!, images);
				}
			}

			// Link the images to the comment created
			if (imageRows) {
				let imageIds = imageRows.map((el: any) => el.id);
				await imageLinkService.linkImagesToComments(
					imageIds,
					commentRow.id
				);
			}

			// Retrieve comment, this time with all the comments
			const commentList = await commentService.readComment(tx, taskId);
			let finalMessage = '';
			finalMessage =
				commentList.length > 0
					? 'Data retrieved successfully.'
					: 'No data found.';

			await setupNotification(
				req.io,
				taskId,
				req.session.userData?.user!
			);

			return res
				.status(200)
				.json(buildResponse(200, finalMessage, commentList));
		} catch (error: any) {
			/**
			 * If there was ever any error
			 * make sure to properly destroy any uploaded images
			 */

			if (Array.isArray(req.files)) {
				const uploaded = req.files;
				if (uploaded.length > 0) {
					deleteUploadedFiles(uploaded, req.upload_location);
				}
			}

			return res
				.status(500)
				.json(buildError(500, 'Error in creating the comment!', error));
		}
	});
}

async function setupNotification(
	io: SocketIOServer,
	taskId: number,
	createdByUser: User
) {
	// Get the task information
	const taskRow = await taskService.readTaskById(taskId);

	// Have this here for safety
	if (taskRow && taskRow?.comments.length > 0) {
		// Get the users who are subscribed to this task
		let userList =
			await taskSubscriptionService.readAllUsersSubscribedToTask(taskId);

		// Do not notify the user that made the comment lol
		userList = userList.filter((el) => el != createdByUser.id);

		// Get the most recent comment
		const commentRow = taskRow.comments[taskRow.comments.length - 1];

		// Build the details of the comment
		const comment = commentRow.message;
		const title = `${createdByUser.firstName} left a comment on task ${taskRow.name}`;
		const description = `${createdByUser.firstName} commented: ${comment}`;
		const payload = {
			taskId,
			actions: PAYLOAD_ACTIONS.TASK_VIEW,
		};
		const notificationData = {
			title,
			description,
			createdByUserId: createdByUser.id,
			payload,
		};

		// Create the notification
		const notificationRow = await notificationService.createNotification(
			notificationData
		);

		// Create the links
		await notificationForUsersService.linkNotificationToUsers(
			notificationRow.id,
			userList
		);

		// Inform the users
		pingUsersOfNewCommentOnTask(io, userList, {
			notification: notificationRow,
			payload: { taskId },
		});
	}
}
