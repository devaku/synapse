import { Task } from '../../database/generated/prisma';
import { PrismaClientOrTransaction } from '../types';

/**
 * REFACTOR THIS CODE TO BE DEPENDENCY INJECTABLE
 */

// Used AI to help with the hidden features on the CRUD FUnctionality stuff, most of the code there is from ChatGPT
// PROMPT: "Help me with adding visibility to the CRUD functions"

export const createTaskService = (tx: PrismaClientOrTransaction) => {
	return {
		createTask: async function createTask(taskObj: any) {
			const taskRow = await tx.task.create({
				data: {
					...taskObj,
				},
				include: {
					createdByUser: {
						select: {
							id: true,
							username: true,
							firstName: true,
							lastName: true,
						},
					},
					taskHiddenFromUsers: true,
					taskVisibleToTeams: true,
					taskVisibleToUsers: true,
				},
			});
			return taskRow;
		},

		readAllTask: async function readAllTask() {
			return await tx.task.findMany({
				where: { isDeleted: 0 },
				include: {
					createdByUser: {
						select: {
							id: true,
							username: true,
							firstName: true,
							lastName: true,
						},
					},
					taskHiddenFromUsers: true,
					taskVisibleToTeams: true,
					taskVisibleToUsers: true,
				},
			});
		},

		readTaskById: async function readTaskById(id: number) {
			return await tx.task.findFirst({
				where: { id, isDeleted: 0 },
				include: {
					comments: {
						include: {
							imagesAttachedToComments: {
								include: {
									image: true,
								},
							},
							user: {
								include: {
									image: true,
								},
							},
						},
					},
					taskUserSubscribeTo: {
						select: {
							user: {
								select: { keycloakId: true },
							},
						},
					},
					createdByUser: {
						select: {
							id: true,
							username: true,
							firstName: true,
							lastName: true,
						},
					},
					deletionRequest: { include: { requestedByUser: true } },
					taskHiddenFromUsers: {
						select: {
							user: {
								omit: {
									keycloakId: true,
								},
							},
						},
					},
					taskVisibleToTeams: {
						select: {
							team: true,
						},
					},
					taskVisibleToUsers: {
						select: {
							user: {
								omit: {
									keycloakId: true,
								},
							},
						},
					},
				},
			});
		},

		readTasksFilteredForUser: async function readTasksFilteredForUser(
			userId: number
		) {
			return await tx.task.findMany({
				where: {
					isArchived: 0,
					isDeleted: 0,
					OR: [
						{ taskVisibleToUsers: { some: { userId } } },
						{
							taskVisibleToTeams: {
								some: {
									team: {
										teamsUsersBelongTo: {
											some: { userId },
										},
									},
								},
							},
						},
					],
					taskHiddenFromUsers: { none: { userId } },
				},
				include: {
					createdByUser: true,
					comments: true,
					taskVisibleToUsers: true,
					taskVisibleToTeams: true,
				},
			});
		},

		readTasksUserIsSubscribedTo: async function readTasksUserIsSubscribedTo(
			userId: number
		) {
			return await tx.task.findMany({
				where: {
					isArchived: 0,
					taskUserSubscribeTo: {
						some: {
							userId,
						},
					},
				},
				include: {
					createdByUser: true,
					comments: true,
					taskVisibleToUsers: true,
					taskVisibleToTeams: true,
				},
			});
		},

		updateTask: async function updateTask(id: number, data: Task) {
			return await tx.task.update({
				where: { id },
				data: {
					...data,
				},
				include: {
					createdByUser: {
						select: {
							id: true,
							username: true,
							firstName: true,
							lastName: true,
						},
					},
					taskHiddenFromUsers: true,
					taskVisibleToTeams: true,
					taskVisibleToUsers: true,
				},
			});
		},

		deleteTask: async function deleteTask(id: number) {
			return await tx.task.update({
				where: { id },
				data: { isDeleted: 1 },
			});
		},
	};
};
