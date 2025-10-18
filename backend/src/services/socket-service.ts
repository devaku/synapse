import { PrismaClientOrTransaction } from '../types';

export const createSocketService = (tx: PrismaClientOrTransaction) => {
	return {
		upsertSocket: async function upsertSocket(
			keycloakId: string,
			sessionId: string
		) {
			const upsertUser = await tx.socket.upsert({
				where: {
					keycloakId,
				},
				update: {
					sessionId,
				},
				create: {
					keycloakId,
					sessionId,
				},
			});

			return upsertUser;
		},
	};
};
