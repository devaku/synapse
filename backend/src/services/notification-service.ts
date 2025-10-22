import { PrismaClientOrTransaction } from '../types';

export const createNotificationService = (tx: PrismaClientOrTransaction) => {
	return {
		createNotification: async function createNotification(
			notificationData: any
		) {
			const rows = await tx.notification.create({
				data: notificationData,
			});
			return rows;
		},

		readAllNotifications: async function readAllNotifications(
			userId: number
		) {
			// Get the latest 10 notifications.
			const rows = await tx.notification.findMany({
				where: {
					notificationForUsers: {
						some: {
							userId,
						},
					},
				},
				take: 10,
				orderBy: {
					createdAt: 'desc',
				},
				include: {
					user: true,
				},
			});

			return rows;
		},
	};
};
