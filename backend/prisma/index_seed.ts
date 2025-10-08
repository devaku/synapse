import { PrismaClient } from '../database/generated/prisma';
const prisma = new PrismaClient();

// SEED REFERENCE:
// https://mysait-my.sharepoint.com/:x:/r/personal/alejokim_uy_edu_sait_ca/_layouts/15/Doc.aspx?sourcedoc=%7B69DB9A50-0214-453B-9E47-D2F89788BAFC%7D&file=Tickets.xlsx&action=default&mobileredirect=true

import { adminSeeds, managerSeeds, employeeSeeds } from './seeds/users';
import { userIcons } from './seeds/images';
import {
	teamsUserBelongTo,
	subscriptionSeeds,
	deletionRequest,
} from './seeds/relationships';
import { taskSeeds } from './seeds/tasks';

async function seed() {
	await iterateSeedList(adminSeeds, prisma.user);
	await iterateSeedList(managerSeeds, prisma.user);
	await iterateSeedList(employeeSeeds, prisma.user);
	await iterateSeedList(userIcons, prisma.image);
	await iterateSeedList(taskSeeds, prisma.task);

	// Relationships
	await iterateSeedList(teamsUserBelongTo, prisma.teamsUsersBelongTo);
	await iterateSeedList(subscriptionSeeds, prisma.taskUserSubscribeTo);
	await iterateSeedList(deletionRequest, prisma.deletionRequest);

	// Attach profile pictures
	const users = await prisma.user.findMany();

	users.map(async (el, index) => {
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

async function iterateSeedList(seedList: any, prismaModel: any) {
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
