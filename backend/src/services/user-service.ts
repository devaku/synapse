import { User } from '../../database/generated/prisma';
import { prismaDb } from '../lib/database';

export async function readAllUsers() {
	const rows = await prismaDb.user.findMany({
		where: {
			isDeleted: 0,
		},
		omit: {
			keycloakId: true,
		},
		include: {
			// team: true,
			// teamsUsersBelongTo: true,
			// createdTasks: true,
			// notification: true,
		},
	});

	return rows;
}

/**
 * Insert or update local database entry of user
 * based on given login information
 * @param userData
 */
export async function upsertUser(userData: User) {
	const upsertUser = await prismaDb.user.upsert({
		where: {
			keycloakId: userData.keycloakId,
		},
		update: {
			...userData,
		},
		create: {
			...userData,
		},
	});

	return upsertUser;
}

export async function readUser(userId: number) {
	const rows = await prismaDb.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			team: true,
			teamsUsersBelongTo: true,
			createdTasks: true,
			notification: true,
		},
	});

	return rows;
}
