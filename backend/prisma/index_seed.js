const { PrismaClient } = require('../database/generated/prisma');
const prisma = new PrismaClient();

const path = require('path');
const fs = require('fs');

const { adminSeeds, managerSeeds, employeeSeeds } = require('./seeds/users');
const { userIcons, taskImages } = require('./seeds/images');
const {
	teamsUserBelongTo,
	subscriptionSeeds,
	deletionRequest,
	imagesAttachedToTasks,
} = require('./seeds/relationships');
const { taskSeeds } = require('./seeds/tasks');

const STORAGE_LOCATION = `${path.join(__dirname, '..')}/src/public/uploads`;

// Create folder if it doesn't exist
fs.mkdirSync(STORAGE_LOCATION, { recursive: true });

async function seed() {
	await iterateSeedList(adminSeeds, prisma.user);
	await iterateSeedList(managerSeeds, prisma.user);
	await iterateSeedList(employeeSeeds, prisma.user);
	await iterateSeedList(userIcons, prisma.image);
	await iterateSeedList(taskImages, prisma.image);
	await iterateSeedList(taskSeeds, prisma.task);

	// Relationships
	await iterateSeedList(teamsUserBelongTo, prisma.teamsUsersBelongTo);
	await iterateSeedList(subscriptionSeeds, prisma.taskUserSubscribeTo);
	await iterateSeedList(deletionRequest, prisma.deletionRequest);
	await iterateSeedList(imagesAttachedToTasks, prisma.imagesAttachedToTasks);

	// Attach profile pictures
	const users = await prisma.user.findMany();

	users.forEach(async (el, index) => {
		await prisma.user.update({
			where: {
				id: el.id,
			},
			data: {
				imageId: index + 1,
			},
		});
	});

	console.log('Successfully seeded table');
}

async function iterateSeedList(seedList, prismaModel) {
	for (let index = 0; index < seedList.length; index++) {
		const element = seedList[index];
		await prismaModel.create({
			data: {
				...element,
			},
		});
	}
}

seed();
