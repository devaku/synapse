import { User } from '../../database/generated/prisma';
import { PrismaClientOrTransaction } from '../types';

export const createUserService = (tx: PrismaClientOrTransaction) => {
	return {
		readAllUsers: async function readAllUsers() {
			const rows = await tx.user.findMany({
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
		},

		/**
		 * Insert or update local database entry of user
		 * based on given login information
		 * @param userData
		 */
		upsertUser: async function upsertUser(userData: User) {
			const upsertUser = await tx.user.upsert({
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
		},

		readUser: async function readUser(userId: number) {
			const rows = await tx.user.findUnique({
				where: {
					id: userId,
				},
				include: {
					team: true,
					teamsUsersBelongTo: true,
					createdTasks: true,
				},
			});

			return rows;
		},

		readUserByKeycloakId: async function readUserByKeycloakId(
			keycloakId: string
		) {
			const rows = await tx.user.findUnique({
				where: {
					keycloakId,
				},
				include: {
					image: true,
					team: true,
					teamsUsersBelongTo: true,
					createdTasks: true,
				},
			});

			return rows;
		},
	};
};
