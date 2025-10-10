import { PrismaClient } from '../../database/generated/prisma';

// export const prisma = new PrismaClient({ log: ['query'] });

export function txtimeoutValue() {
	if (process.env.NODE_ENV === 'DEVELOPMENT') {
		return 999999;
	} else {
		return 5000;
	}
}
export const prismaDb: PrismaClient = new PrismaClient();
