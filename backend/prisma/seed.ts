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
			connect: [{ id: 1 }],
		},
		firstName: 'user2Fname',
		lastName: 'user2Lname',
		phone: 123,
	},
];

async function seed() {
	// Clean tables
	await prisma.user.deleteMany({});
	await prisma.team.deleteMany({});

	for (let index = 0; index < userSeeds.length; index++) {
		const element = userSeeds[index];
		await prisma.user.create({
			data: {
				...element,
			},
		});
	}

	console.log('Successfully seeded table');
}

seed();
