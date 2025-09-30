import { PrismaClient } from '../database/generated/prisma';
const prisma = new PrismaClient();

// SEED REFERENCE:
// https://mysait-my.sharepoint.com/:x:/r/personal/alejokim_uy_edu_sait_ca/_layouts/15/Doc.aspx?sourcedoc=%7B69DB9A50-0214-453B-9E47-D2F89788BAFC%7D&file=Tickets.xlsx&action=default&mobileredirect=true

let adminSeeds = [
	{
		username: 'admin1',
		email: 'admin1@email.com',

		// Make sure this is the same as it was in keycloak
		keycloakId: '76b4b8d2-7d5d-4c87-948c-fbba7f7237af',
		team: {
			create: {
				name: 'Everyone',
				description: 'THIS TEAM CANNOT BE DELETED',
			},
		},
		firstName: 'first_name',
		lastName: 'last_name',
		phone: 123,
	},
];

let managerSeeds = [
	{
		username: 'manager1',
		email: 'manager1@email.com',

		// Make sure this is the same as it was in keycloak
		keycloakId: 'cfe3053a-babe-4bfe-bac2-841bdaecc3c8',
		team: {
			create: {
				name: 'Team 1',
				description: 'This is Team 1',
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
				name: 'Team 2',
				description: 'This is Team 2',
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

		firstName: 'Manager3',
		lastName: 'Manager3',
		phone: 123,
	},
];

let employeeSeeds = [
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

let teamsUserBelongTo = [
	// Manager1
	{ teamId: 1, userId: 2 },
	{ teamId: 2, userId: 2 },

	// Manager2
	{ teamId: 1, userId: 3 },
	{ teamId: 3, userId: 3 },

	// Manager3
	{ teamId: 1, userId: 4 },
	{ teamId: 2, userId: 4 },

	// User1
	{ teamId: 1, userId: 5 },
	{ teamId: 2, userId: 5 },

	// User2
	{ teamId: 1, userId: 6 },
	{ teamId: 3, userId: 6 },

	// User3
	{ teamId: 1, userId: 7 },
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
					teamId: 2,
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
					teamId: 2,
				},
				{
					teamId: 3,
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

const subscriptionSeeds = [
	// User 1 is subscribed to task 1 and 2
	{ userId: 5, taskId: 1 },
	{ userId: 5, taskId: 2 },

	// Manager3 is subscribed to Task 1, 2, and 3
	{ userId: 4, taskId: 1 },
	{ userId: 4, taskId: 2 },
	{ userId: 4, taskId: 3 },
];

async function seed() {
	await iterateSeedList(adminSeeds, prisma.user);
	await iterateSeedList(managerSeeds, prisma.user);
	await iterateSeedList(employeeSeeds, prisma.user);
	await iterateSeedList(taskSeeds, prisma.task);

	// Relationships
	await iterateSeedList(teamsUserBelongTo, prisma.teamsUsersBelongTo);
	await iterateSeedList(subscriptionSeeds, prisma.taskUserSubscribeTo);

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
