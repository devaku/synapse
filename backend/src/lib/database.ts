import { PrismaClient } from '../../database/generated/prisma';
// export const prisma = new PrismaClient({ log: ['query'] });
export const prismaDb = new PrismaClient();
