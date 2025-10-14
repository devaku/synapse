import { prismaDb } from '../lib/database';

/**
 * Create a new subscription linking a user to a task
 * This is called when a user clicks "subscribe" or "follow" on a task
 */
export async function subscribeToTask(userId: number, taskId: number) {
	// Insert a new row into the taskUserSubscribeTo table
	return prismaDb.taskUserSubscribeTo.create({
		data: { userId, taskId },
	});
}

/**
 * Remove a subscription between a user and a task
 * This is called when a user wants to unsubscribe/unfollow a task
 */
export async function unsubscribeFromTask(userId: number, taskId: number) {
	return prismaDb.taskUserSubscribeTo.delete({
		where: {
			userId_taskId: { userId, taskId },
		},
	});
}

/**
 * Get all tasks that a specific user is subscribed to
 * Returns an array of task objects (not the subscription records)
 */
export async function getSubscribedTasks(userId: number) {
	const subs = await prismaDb.taskUserSubscribeTo.findMany({
		where: { userId },
		include: { task: true },
	});

	return subs.map((s) => s.task);
}
