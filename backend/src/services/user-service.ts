import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { User } from '../../database/generated/prisma';
import { prisma } from '../lib/database';

/**
 * Insert or update local database entry of user
 * based on given login information
 * @param userData
 */
export async function upsertUser(userData: User) {
	const upsertUser = await prisma.user.upsert({
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
	const rows = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		include: {
			team: true,
			createdTasks: true,
			notification: true,
		},
	});

	return rows;
}
