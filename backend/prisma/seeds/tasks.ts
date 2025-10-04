export const taskSeeds = [
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
	{
		// This task is visible to EVERYONE
		createdByUserId: 2,
		priority: 'LOW',
		name: 'task 4',
		description: 'Visible to everyone',
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
	},
	{
		// This task is visible to EVERYONE
		createdByUserId: 2,
		priority: 'LOW',
		name: 'task 5',
		description: 'Visible to everyone',
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
	},
	{
		// This task is visible to EVERYONE
		createdByUserId: 2,
		priority: 'LOW',
		name: 'task 6',
		description: 'Visible to everyone',
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
	},
	{
		// This task is visible to EVERYONE
		createdByUserId: 2,
		priority: 'MEDIUM',
		name: 'task 7',
		description: 'Visible to everyone',
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
	},
	{
		// This task is visible to EVERYONE
		createdByUserId: 2,
		priority: 'MEDIUM',
		name: 'task 8',
		description: 'Visible to everyone',
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
	},
	{
		// This task is visible to EVERYONE
		createdByUserId: 2,
		priority: 'HIGH',
		name: 'task 9',
		description: 'Visible to everyone',
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
	},
	{
		// This task is visible to EVERYONE
		createdByUserId: 2,
		priority: 'HIGH',
		name: 'task 10',
		description: 'Visible to everyone',
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
	},
];
