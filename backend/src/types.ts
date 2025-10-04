import { User } from '../database/generated/prisma';
import { Server as SocketIOServer } from 'socket.io';

// Type declaration provided by chatgpt
declare global {
	namespace Express {
		interface Request {
			io: SocketIOServer;
		}
	}
}

export type teamType = {
	createdBy: number;
	name: string;
	description: string;
	createdAt: Date;
};

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
