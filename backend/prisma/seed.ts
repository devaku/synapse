import { PrismaClient } from '../database/generated/prisma';
const prisma = new PrismaClient();

let adminSeeds = [];
let managerSeeds = [];
let employeeSeeds = [];

let userAndTeamSeeds = [
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
		team: {
			create: {
				name: 'team1',
				description: 'this is team 1',
			},
		},
		firstName: 'ManagerFname',
		lastName: 'ManagerLname',
		phone: 123,
	},
	{
		username: 'manager2',
		email: 'manager2@email.com',

		// Make sure this is the same as it was in keycloak
		keycloakId: 'caf69623-bb5f-4601-8cc0-c9a518aa7910',
		team: {
			create: {
				name: 'team2',
				description: 'this is team 2',
			},
		},
		firstName: 'manager2',
		lastName: 'manager2',
		phone: 123,
	},
	{
		username: 'manager3',
		email: 'manager3@email.com',

		// Make sure this is the same as it was in keycloak
		keycloakId: '47b82f0a-b462-4df2-90f2-ac67c530898d',
		team: {
			connect: [{ id: 1 }],
		},
		firstName: 'Manager3',
		lastName: 'Manager3',
		phone: 123,
	},

	{
		username: 'user1',
		email: 'user1@email.com',

		// Make sure this is the same as it was in keycloak
		keycloakId: 'be42ed78-fa69-4091-8243-da05ad65eafe',
		team: {
			connect: [{ id: 1 }],
		},
		firstName: 'user1Fname',
		lastName: 'user1Lname',
		phone: 123,
	},

	{
		username: 'user2',
		email: 'user2@email.com',

		// Make sure this is the same as it was in keycloak
		keycloakId: '7511b747-b572-4420-9ba3-0bacdbcfc303',
		team: {
			connect: [{ id: 2 }],
		},
		firstName: 'user2Fname',
		lastName: 'user2Lname',
		phone: 123,
	},
	{
		username: 'user3',
		email: 'user3@email.com',

		// Make sure this is the same as it was in keycloak
		keycloakId: '6e69c670-4e0e-4884-8c61-7d71c848f379',
		firstName: 'user3',
		lastName: 'user3',
		phone: 123,
	},
];

let taskSeeds = [
	{
		// This task is only visible to
		// Team 1, to manager1
		// and hidden from User2
		createdByUserId: 2,
		priority: 'URGENT',
		name: 'task 1',
		description: 'This is a task',
		taskVisibleToTeams: {
			create: [
				{
					teamId: 1,
				},
			],
		},
		taskVisibleToUsers: {
			create: [
				{
					userId: 2,
				},
			],
		},
		taskHiddenFromUsers: {
			create: [
				{
					userId: 7,
				},
			],
		},
	},
	{
		// This task is only visible to
		// Team 1, 2, and manager2,
		// and is hidden from manager1
		createdByUserId: 3,
		priority: 'URGENT',
		name: 'task 2',
		description: '2nd Task',
		taskVisibleToTeams: {
			create: [
				{
					teamId: 1,
				},
				{
					teamId: 2,
				},
			],
		},
		taskVisibleToUsers: {
			create: [
				{
					userId: 3,
				},
			],
		},
		taskHiddenFromUsers: {
			create: [
				{
					userId: 2,
				},
			],
		},
	},
	{
		// This task is only visible
		// To manager3
		createdByUserId: 4,
		priority: 'URGENT',
		name: 'task 3',
		description: 'This is the third task',
		taskVisibleToUsers: {
			create: [
				{
					userId: 4,
				},
			],
		},
	},
];

async function seed() {
	// Clean tables
	await prisma.user.deleteMany({});
	await prisma.team.deleteMany({});
	await prisma.task.deleteMany({});

	// Insert user and teams
	for (let index = 0; index < userAndTeamSeeds.length; index++) {
		const element = userAndTeamSeeds[index];
		await prisma.user.create({
			data: {
				...element,
			},
		});
	}

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
