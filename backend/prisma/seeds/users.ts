export const adminSeeds = [
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

export const managerSeeds = [
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

export const employeeSeeds = [
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
