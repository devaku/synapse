import { PrismaClientOrTransaction } from '../types';

export const createVisibilityService = (tx: PrismaClientOrTransaction) => {
	return {
		updateTaskVisibleToTeamsRelations:
			async function updateTaskVisibleToTeamsRelations(
				valuesToBeDeleted: number[],
				valuesToBeCreated: number[],
				taskId: number
			) {
				if (valuesToBeDeleted.length > 0) {
					await deleteTaskVisibleToTeamRelations(
						tx,
						valuesToBeDeleted,
						taskId
					);
				}

				if (valuesToBeCreated.length > 0) {
					await createTaskVisibleToTeamRelations(
						tx,
						valuesToBeCreated,
						taskId
					);
				}
			},

		updateTaskVisibleToUsersRelations:
			async function updateTaskVisibleToUsersRelations(
				valuesToBeDeleted: number[],
				valuesToBeCreated: number[],
				taskId: number
			) {
				if (valuesToBeDeleted.length > 0) {
					await deleteTaskVisibleToUsersRelations(
						tx,
						valuesToBeDeleted,
						taskId
					);
				}

				if (valuesToBeCreated.length > 0) {
					await createTaskVisibleToUsersRelations(
						tx,
						valuesToBeCreated,
						taskId
					);
				}
			},

		updateTaskHiddenFromUsersRelations:
			async function updateTaskHiddenFromUsersRelations(
				valuesToBeDeleted: number[],
				valuesToBeCreated: number[],
				taskId: number
			) {
				if (valuesToBeDeleted.length > 0) {
					await deleteTaskHiddenFromUsersRelations(
						tx,
						valuesToBeDeleted,
						taskId
					);
				}

				if (valuesToBeCreated.length > 0) {
					await createTaskHiddenFromUsersRelations(
						tx,
						valuesToBeCreated,
						taskId
					);
				}
			},
	};
};

async function createTaskVisibleToTeamRelations(
	tx: PrismaClientOrTransaction,
	teamIds: number[],
	taskId: number
) {
	let data = teamIds.map((el) => {
		return { teamId: el, taskId };
	});

	return await tx.taskVisibleToTeams.createMany({
		data,
		skipDuplicates: true,
	});
}

async function createTaskVisibleToUsersRelations(
	tx: PrismaClientOrTransaction,
	userIds: number[],
	taskId: number
) {
	let data = userIds.map((el) => {
		return { userId: el, taskId };
	});

	return await tx.taskVisibleToUsers.createMany({
		data,
		skipDuplicates: true,
	});
}

async function createTaskHiddenFromUsersRelations(
	tx: PrismaClientOrTransaction,
	userIds: number[],
	taskId: number
) {
	let data = userIds.map((el) => {
		return { userId: el, taskId };
	});

	return await tx.taskHiddenFromUsers.createMany({
		data,
		skipDuplicates: true,
	});
}

async function deleteTaskVisibleToTeamRelations(
	tx: PrismaClientOrTransaction,
	teamIds: number[],
	taskId: number
) {
	return await tx.taskVisibleToTeams.deleteMany({
		where: {
			taskId,
			teamId: {
				in: teamIds,
			},
		},
	});
}

async function deleteTaskVisibleToUsersRelations(
	tx: PrismaClientOrTransaction,
	userIds: number[],
	taskId: number
) {
	return await tx.taskVisibleToUsers.deleteMany({
		where: {
			taskId,
			userId: {
				in: userIds,
			},
		},
	});
}

async function deleteTaskHiddenFromUsersRelations(
	tx: PrismaClientOrTransaction,
	userIds: number[],
	taskId: number
) {
	return await tx.taskHiddenFromUsers.deleteMany({
		where: {
			taskId,
			userId: {
				in: userIds,
			},
		},
	});
}
