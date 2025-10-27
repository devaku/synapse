import { prismaDb } from '../../lib/database';

export class CommentHandlers {
	/**
	 * Add a comment to a task
	 */
	static async addComment(params: any, userId: number) {
		try {
			const { taskId, message } = params;

			// Check if task exists
			const task = await prismaDb.task.findUnique({
				where: { id: taskId },
			});

			if (!task) {
				return {
					success: false,
					message: 'Task not found',
				};
			}

			const comment = await prismaDb.comment.create({
				data: {
					userId,
					taskId,
					message,
				},
			});

			return {
				success: true,
				data: comment,
				message: 'Comment added successfully',
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message,
				message: 'Failed to add comment',
			};
		}
	}

	/**
	 * Read comments for a task
	 */
	static async readComments(params: any, userId: number) {
		try {
			const { taskId, limit } = params;

			const comments = await prismaDb.comment.findMany({
				where: {
					taskId,
					isDeleted: 0,
				},
				orderBy: {
					createdAt: 'desc',
				},
				take: limit,
				include: {
					user: {
						select: {
							id: true,
							username: true,
							firstName: true,
							lastName: true,
						},
					},
				},
			});

			return {
				success: true,
				data: comments,
				message: `Found ${comments.length} comments`,
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message,
				message: 'Failed to read comments',
			};
		}
	}

	/**
	 * Archive a task
	 */
	static async archiveTask(params: any, userId: number) {
		try {
			const { taskId } = params;

			// Check if task exists
			const task = await prismaDb.task.findUnique({
				where: { id: taskId },
			});

			if (!task) {
				return {
					success: false,
					message: 'Task not found',
				};
			}

			const archivedTask = await prismaDb.task.update({
				where: { id: taskId },
				data: {
					isArchived: 1,
					archivedByUserId: userId,
				},
			});

			return {
				success: true,
				data: archivedTask,
				message: 'Task archived successfully',
			};
		} catch (error: any) {
			return {
				success: false,
				error: error.message,
				message: 'Failed to archive task',
			};
		}
	}
}
