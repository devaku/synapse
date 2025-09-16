// These mirror the same column names in the database

export type userType = {
	keycloakId: string;
	teamId: number;
	firstName?: string;
	lastName?: string;
	phone?: number;
	createdAt: Date;
};

export type taskType = {
	createdBy: number;
	assignedTo: number;
	priority: string;
	name: string;
	description: string;
	image?: string;
	startDate?: Date;
	completeDate?: Date;
	createdAt: Date;
};
