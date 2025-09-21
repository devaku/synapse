export type jsonResponse = {
	statusCode: number;
	statusText: string;
	message: string;
	data?: any[];
	error?: any;
};

export type User = {};

export type Task = {
	id: number;
	createdByUserId: number;
	createdByUser?: any;
	assignedTo?: number;
	assignedToUser?: any;
	priority: string;
	name: string;
	description: string;
	image?: string;
	startDate?: string;
	completeDate?: string;
	createdAt: string;
};
