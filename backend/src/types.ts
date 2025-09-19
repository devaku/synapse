// These mirror the same column names in the database

import { type User } from '../database/generated/prisma';

export type jsonResponse = {
	statusCode: number;
	statusText: string;
	message: string;
	data?: any[];
	error?: any;
};

export type sessionJson = {
	user: User;
	roles: string[];
};
