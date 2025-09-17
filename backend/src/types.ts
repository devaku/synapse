// These mirror the same column names in the database

export type jsonResponse = {
	statusCode: number;
	statusText: string;
	message: string;
	data?: any[];
	error?: any;
};
