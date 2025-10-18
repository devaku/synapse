module.exports.subscriptionSeeds = [
	// Manager1 is subscribed
	{ userId: 2, taskId: 1 },
	{ userId: 2, taskId: 4 },
	{ userId: 2, taskId: 5 },
	{ userId: 2, taskId: 6 },
	{ userId: 2, taskId: 7 },
	{ userId: 2, taskId: 8 },
	{ userId: 2, taskId: 9 },
	{ userId: 2, taskId: 10 },

	// Manager2
	{ userId: 3, taskId: 2 },

	// Manager3 is subscribed to Task 1, 2, and 3
	{ userId: 4, taskId: 1 },
	{ userId: 4, taskId: 2 },
	{ userId: 4, taskId: 3 },

	// User 1 is subscribed to task 1 and 2
	{ userId: 5, taskId: 1 },
	{ userId: 5, taskId: 2 },
];

module.exports.teamsUserBelongTo = [
	// Manager1
	{ teamId: 1, userId: 2 },
	{ teamId: 2, userId: 2 },
	{ teamId: 3, userId: 2 },

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

module.exports.deletionRequest = [
	// User1 submitted request
	{
		taskId: 1,
		requestedByUserId: 5,
		reason: 'This is a seeded request',
	},
];

module.exports.imagesAttachedToTasks = [
	{
		imageId: 51,
		taskId: 1,
	},
	{
		imageId: 52,
		taskId: 1,
	},
	{
		imageId: 53,
		taskId: 1,
	},
	{
		imageId: 54,
		taskId: 1,
	},
	{
		imageId: 55,
		taskId: 1,
	},
];
