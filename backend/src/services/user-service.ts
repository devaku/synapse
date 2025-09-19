import { prisma } from '../lib/database';

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
