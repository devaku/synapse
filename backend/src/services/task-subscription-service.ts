import { PrismaClientOrTransaction } from '../types';

export const createTaskSubscriptionService = (
	tx: PrismaClientOrTransaction
) => {
	return {
		readAllUsersSubscribedToTask:
			async function readAllUsersSubscribedToTask(taskId: number) {
				const subs = await tx.taskUserSubscribeTo.findMany({
					where: { taskId },
				});

				return subs.map((el) => el.userId);
			},

		/**
		 * Create a new subscription linking a user to a task
		 * This is called when a user clicks "subscribe" or "follow" on a task
		 */
		subscribeToTask: async function subscribeToTask(
			userId: number,
			taskId: number
		) {
			// Insert a new row into the taskUserSubscribeTo table
			return tx.taskUserSubscribeTo.create({
				data: { userId, taskId },
			});
		},

		/**
		 * Remove a subscription between a user and a task
		 * This is called when a user wants to unsubscribe/unfollow a task
		 */
		unsubscribeFromTask: async function unsubscribeFromTask(
			userId: number,
			taskId: number
		) {
			return tx.taskUserSubscribeTo.delete({
				where: {
					userId_taskId: { userId, taskId },
				},
			});
		},

		/**
		 * Get all tasks that a specific user is subscribed to
		 * Returns an array of task objects (not the subscription records)
		 */

		getSubscribedTasks: async function getSubscribedTasks(userId: number) {
			const subs = await tx.taskUserSubscribeTo.findMany({
				where: { userId },
				include: { task: true },
			});

			return subs.map((s) => s.task);
		},
	};
};
