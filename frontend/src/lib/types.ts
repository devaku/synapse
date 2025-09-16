export type jsonResponse = {
	statusCode: number;
	statusText: string;
	message: string;
	data?: any[];
	error?: any;
};

export type taskType = {
	id: number;
	createdBy: number;
	assignedTo?: number;
	priority: string;
	name: string;
	description: string;
	image?: string;
	startDate?: Date;
	completeDate?: Date;
	createdAt?: Date;
};
