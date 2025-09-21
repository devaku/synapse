import { PrismaClient } from '../database/generated/prisma';
const prisma = new PrismaClient();

let userSeeds = [
	{
		username: 'admin1',
		email: 'admin1@email.com',

		// Make sure this is the same as it was in keycloak
		keycloakId: '76b4b8d2-7d5d-4c87-948c-fbba7f7237af',
		firstName: 'first_name',
		lastName: 'last_name',
		phone: 123,
	},
	{
		username: 'manager1',
		email: 'manager1@email.com',

		// Make sure this is the same as it was in keycloak
		keycloakId: 'cfe3053a-babe-4bfe-bac2-841bdaecc3c8',
		firstName: 'ManagerFname',
		lastName: 'ManagerLname',
		phone: 123,
	},

	{
		username: 'user1',
		email: 'user1@email.com',

		// Make sure this is the same as it was in keycloak
		keycloakId: 'be42ed78-fa69-4091-8243-da05ad65eafe',
		firstName: 'user1Fname',
		lastName: 'user1Lname',
		phone: 123,
	},

	{
		username: 'user2',
		email: 'user2@email.com',

		// Make sure this is the same as it was in keycloak
		keycloakId: '7511b747-b572-4420-9ba3-0bacdbcfc303',
		firstName: 'user2Fname',
		lastName: 'user2Lname',
		phone: 123,
	},
];

let teamSeeds = [
	{
		name: 'team1',
		description: 'this is team 1',
		createdBy: 2, // manager1 user id
	},
];

let taskSeeds = [
	{
		createdByUserId: 2,
		priority: 'URGENT',
		name: 'task 1',
		description: 'This is a task',
	},
	{
		createdByUserId: 2,
		priority: 'URGENT',
		name: 'task 2',
		description: '2nd Task',
	},
	{
		createdByUserId: 2,
		priority: 'URGENT',
		name: 'task 3',
		description: 'This is the third task',
	},
];

async function seed() {
	// Clean tables
	await prisma.user.deleteMany({});
	await prisma.team.deleteMany({});
	await prisma.task.deleteMany({});

	// Insert users first
	for (let index = 0; index < userSeeds.length; index++) {
		const element = userSeeds[index];
		await prisma.user.create({
			data: {
				...element,
			},
		});
	}

	// Insert teams
	for (let index = 0; index < teamSeeds.length; index++) {
		const element = teamSeeds[index];
		await prisma.team.create({
			data: {
				...element,
			},
		});
	}

	// Now connect users to teams
	await prisma.user.update({
		where: { id: 2 }, // manager1
		data: {
			team: {
				connect: { id: 1 }, // team1
			},
		},
	});

	await prisma.user.update({
		where: { id: 3 }, // user1
		data: {
			team: {
				connect: { id: 1 }, // team1
			},
		},
	});

	await prisma.user.update({
		where: { id: 4 }, // user2
		data: {
			team: {
				connect: { id: 1 }, // team1
			},
		},
	});

	// Insert tasks
	for (let index = 0; index < taskSeeds.length; index++) {
		const element = taskSeeds[index];
		await prisma.task.create({
			data: {
				...element,
			},
		});
	}

	console.log('Successfully seeded table');
}

seed();
