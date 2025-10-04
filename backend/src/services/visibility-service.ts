import { Prisma } from '@prisma/client';

export async function updateTaskVisibleToTeamsRelations(
	tx: Prisma.TransactionClient,
	valuesToBeDeleted: number[],
	valuesToBeCreated: number[],
	taskId: number
) {
	if (valuesToBeDeleted.length > 0) {
		await deleteTaskVisibleToTeamRelations(tx, valuesToBeDeleted, taskId);
	}

	if (valuesToBeCreated.length > 0) {
		await createTaskVisibleToTeamRelations(tx, valuesToBeCreated, taskId);
	}
}

export async function updateTaskVisibleToUsersRelations(
	tx: Prisma.TransactionClient,
	valuesToBeDeleted: number[],
	valuesToBeCreated: number[],
	taskId: number
) {
	if (valuesToBeDeleted.length > 0) {
		await deleteTaskVisibleToUsersRelations(tx, valuesToBeDeleted, taskId);
	}

	if (valuesToBeCreated.length > 0) {
		await createTaskVisibleToUsersRelations(tx, valuesToBeCreated, taskId);
	}
}

export async function updateTaskHiddenFromUsersRelations(
	tx: Prisma.TransactionClient,
	valuesToBeDeleted: number[],
	valuesToBeCreated: number[],
	taskId: number
) {
	if (valuesToBeDeleted.length > 0) {
		await deleteTaskHiddenFromUsersRelations(tx, valuesToBeDeleted, taskId);
	}

	if (valuesToBeCreated.length > 0) {
		await createTaskHiddenFromUsersRelations(tx, valuesToBeCreated, taskId);
	}
}

async function createTaskVisibleToTeamRelations(
	tx: Prisma.TransactionClient,
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
	tx: Prisma.TransactionClient,
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
	tx: Prisma.TransactionClient,
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
	tx: Prisma.TransactionClient,
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
	tx: Prisma.TransactionClient,
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
	tx: Prisma.TransactionClient,
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
