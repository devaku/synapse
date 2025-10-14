import { Task } from '../../database/generated/prisma';
import { PrismaClientOrTransaction } from '../types';

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
			let row = await tx.task.findMany({
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
			return row;
		},

		readTaskById: async function readTaskById(id: number) {
			let row = await tx.task.findFirst({
				where: { id, isDeleted: 0 },
				include: {
					imagesAttachedToTasks: {
						include: { image: true },
					},
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
			return row;
		},

		readTasksFilteredForUser: async function readTasksFilteredForUser(
			userId: number
		) {
			let row = await tx.task.findMany({
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
				orderBy: {
					createdAt: 'desc',
				},
			});
			return row;
		},

		readTasksUserIsSubscribedTo: async function readTasksUserIsSubscribedTo(
			userId: number
		) {
			let row = await tx.task.findMany({
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
			return row;
		},

		updateTask: async function updateTask(id: number, data: Task) {
			let row = await tx.task.update({
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
					imagesAttachedToTasks: true,
					taskHiddenFromUsers: true,
					taskVisibleToTeams: true,
					taskVisibleToUsers: true,
				},
			});
			return row;
		},

		deleteTask: async function deleteTask(id: number) {
			let row = await tx.task.update({
				where: { id },
				data: { isDeleted: 1 },
			});
			return row;
		},
	};
};
