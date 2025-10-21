import { prismaDb } from '../database';
import { createNotificationService } from '../../services/notification-service';
import { createNotificationForUsersService } from '../../services/link_tables/notification-for-users-service';

type NotificationBody = {
	createdByUserId: number;
	description: string;
	title: string;
	payload: any | {};
};

export async function createNotification(
	notificationBody: NotificationBody,
	userList: number[]
) {
	const notificationService = createNotificationService(prismaDb);
	const notificationForUsersService =
		createNotificationForUsersService(prismaDb);

	let notificationRow = await notificationService.createNotification(
		notificationBody
	);

	await notificationForUsersService.linkNotificationToUsers(
		notificationRow.id,
		userList
	);
}
