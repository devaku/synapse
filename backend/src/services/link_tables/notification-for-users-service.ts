import { PrismaClientOrTransaction } from '../../types';

export const createNotificationForUsersService = (
	tx: PrismaClientOrTransaction
) => {
	return {
		linkNotificationToUsers: async function linkNotificationToUsers(
			notificationId: number,
			userList: number[]
		) {
			const rows = await tx.notificationForUsers.createMany({
				data: userList.map((el) => {
					return {
						notificationId,
						userId: Number(el),
						status: 'SENT',
						updatedAt: new Date(),
					};
				}),
			});
			return rows;
		},

		updateNotificationStatus: async function updateNotificationStatus(
			notificationList: number[],
			userId: number,
			status: string
		) {
			const rows = await tx.notificationForUsers.updateMany({
				where: {
					notificationId: {
						in: notificationList,
					},
					userId,
				},
				data: notificationList.map((el) => {
					return {
						notificationId: el,
						userId: userId,
						status: status,
						updatedAt: new Date(),
					};
				}),
			});
			return rows;
		},
	};
};
