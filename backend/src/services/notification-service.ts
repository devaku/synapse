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
	};
};
