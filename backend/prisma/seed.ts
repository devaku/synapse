import { PrismaClient } from '../src/database/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const ENV_PATH = path.join(__dirname, '..', '.env.debug');

// Load env vars if needed
if (!process.env.DATABASE_URL) {
	dotenv.config({ path: ENV_PATH });
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({
	connectionString: DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// Seed imports
import { adminSeeds, managerSeeds, employeeSeeds } from './seeds/users';

import { userIcons, taskImages } from './seeds/images';

import {
	teamsUserBelongTo,
	subscriptionSeeds,
	deletionRequest,
	imagesAttachedToTasks,
} from './seeds/relationships';

import { taskSeeds } from './seeds/tasks';

const STORAGE_LOCATION = `${path.join(__dirname, '..')}/src/public/uploads`;

// Create folder if it doesn't exist
fs.mkdirSync(STORAGE_LOCATION, { recursive: true });

async function seed(): Promise<void> {
	await iterateSeedList(adminSeeds, prisma.user);
	await iterateSeedList(managerSeeds, prisma.user);
	await iterateSeedList(employeeSeeds, prisma.user);

	await iterateImageList(userIcons, prisma.image);
	await iterateImageList(taskImages, prisma.image);

	await iterateSeedList(taskSeeds, prisma.task);

	// Relationships
	await iterateSeedList(teamsUserBelongTo, prisma.teamsUsersBelongTo);
	await iterateSeedList(subscriptionSeeds, prisma.taskUserSubscribeTo);
	await iterateSeedList(deletionRequest, prisma.deletionRequest);
	await iterateSeedList(imagesAttachedToTasks, prisma.imagesAttachedToTasks);

	// Attach profile pictures
	const users = await prisma.user.findMany();

	for (let index = 0; index < users.length; index++) {
		const el = users[index];
		await prisma.user.update({
			where: { id: el.id },
			data: { imageId: index + 1 },
		});
	}

	console.log('Successfully seeded table');
}

async function iterateImageList<T extends { imagePath: string }>(
	seedList: T[],
	prismaModel: any
): Promise<void> {
	for (let index = 0; index < seedList.length; index++) {
		const element = { ...seedList[index] };

		const {
			_max: { id: maxId },
		} = await prismaModel.aggregate({ _max: { id: true } });

		const imageBlob = fs.readFileSync(element.imagePath);
		delete (element as Partial<T>).imagePath;

		await prismaModel.create({
			data: {
				imageUrl: `${process.env.SERVER_URL}/api/v1/debug/image/${
					(maxId ?? 0) + 1
				}`,
				imageBlob,
				...element,
			},
		});
	}
}

async function iterateSeedList<T>(
	seedList: T[],
	prismaModel: any
): Promise<void> {
	for (let index = 0; index < seedList.length; index++) {
		await prismaModel.create({
			data: {
				...seedList[index],
			},
		});
	}
}

seed()
	.catch((err) => {
		console.error(err);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
