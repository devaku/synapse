export const subscriptionSeeds = [
	// User 1 is subscribed to task 1 and 2
	{ userId: 5, taskId: 1 },
	{ userId: 5, taskId: 2 },

	// Manager3 is subscribed to Task 1, 2, and 3
	{ userId: 4, taskId: 1 },
	{ userId: 4, taskId: 2 },
	{ userId: 4, taskId: 3 },
];

export const teamsUserBelongTo = [
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

export const deletionRequest = [
	// User1 submitted request
	{
		taskId: 1,
		requestedByUserId: 5,
		reason: 'This is a seeded request',
	},
];
