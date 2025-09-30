import { DeletionRequest } from '../../database/generated/prisma';
import { prisma } from '../lib/database';

export async function createDeletionRequest(deletionRequest: DeletionRequest) {
	const teamRow = await prisma.deletionRequest.create({
		data: {
			...deletionRequest,
		},
	});

	return teamRow;
}

export async function readDelRequest(id: number) {
	const teamrow = await prisma.deletionRequest.findMany({
		where: {
			id,
		},
		include: {
			task: true,
			user: true,
		},
	});

	return teamrow;
}
