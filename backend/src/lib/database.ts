import { PrismaClient } from '../database/generated/prisma/client';
import { NODE_ENV, DATABASE_URL } from './env-variables';
import { PrismaPg } from '@prisma/adapter-pg';

// export const prisma = new PrismaClient({ log: ['query'] });

export function txtimeoutValue() {
	if (NODE_ENV === 'DEVELOPMENT') {
		return 999999;
	} else {
		return 5000;
	}
}
const adapter = new PrismaPg({
	connectionString: DATABASE_URL,
});
export const prismaDb: PrismaClient = new PrismaClient({ adapter });
