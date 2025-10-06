import { DeletionRequest } from '../../database/generated/prisma';
import { prismaDb } from '../lib/database';

export async function createDeletionRequest(deletionRequest: DeletionRequest) {
	const teamRow = await prismaDb.deletionRequest.create({
		data: {
			...deletionRequest,
		},
	});

	return teamRow;
}

export async function readDelRequest(id: number) {
	const teamrow = await prismaDb.deletionRequest.findMany({
		where: {
			id,
		},
		include: {
			task: true,
			requestedByUser: true,
		},
	});

	return teamrow;
}
