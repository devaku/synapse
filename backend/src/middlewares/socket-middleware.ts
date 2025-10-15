import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prismaDb } from '../lib/database';
import { Socket, Server as SocketIOServer } from 'socket.io';
import type { Server as HttpServer } from 'http';
import { createSocketService } from '../services/socket-service';
import { createTaskService } from '../services/task-service';
import { createUserService } from '../services/user-service';

const socketService = createSocketService(prismaDb);
const taskService = createTaskService(prismaDb);
const userService = createUserService(prismaDb);

export function socketMiddleware(httpServer: HttpServer) {
	const io = new SocketIOServer(httpServer, {
		cors: {
			origin: 'http://localhost:3000',
		},
	});

	io.use(validateSocket);
	io.on('connection', async (socket: Socket) => {
		const userId = socket.session.userData?.user.id;
		console.log(
			`User: ${socket.session.userData?.user.keycloakId} connected to the socket!`
		);

		// User is in his own room. lol
		socket.join(`USER-${userId}`);

		// Setup the session
		await validateSession(socket);

		// Get all the task the user is subscribed to
		// And subscribe to those for the socket
		await subscribeToTasks(socket);

		await subscribeToTeams(socket);

		/**
		 * Notifications
		 * - A task is made visible to you
		 * - A comment is created on a Task you are subscribed to
		 * - When a Task is completed but you didn't complete it yourself
		 */

		listAllRooms(io);

		socket.on('DEBUG:ACKNOWLEDGEBMENT', (arg1, callback) => {
			console.log(arg1); // 1
			callback({
				status: 'ok',
			});
		});
		socket.on('disconnect', (reason) => {
			console.log(reason);
		});
	});

	return io;
}

async function subscribeToTeams(socket: Socket) {
	const userId = socket.session.userData?.user.id;

	// Get all the teams the user is part of
	const user = await userService.readUser(userId!);
	const teams = user?.teamsUsersBelongTo;
	if (teams && teams.length > 0) {
		// Have user join those rooms
		teams.map((el) => {
			socket.join(`TEAM-${el.teamId}`);
		});
	}
}

async function subscribeToTasks(socket: Socket) {
	const userId = socket.session.userData?.user.id;
	const sessionId = socket.handshake.auth.sessionId;

	// Get all the task the user is subscribed to
	const tasks = await taskService.readTasksUserIsSubscribedTo(userId!);

	if (tasks.length > 0) {
		// Have user join those rooms
		tasks.map((el) => {
			socket.join(`TASK-${el.id}`);
		});
	}
}

async function validateSession(socket: Socket) {
	// Check if a session ID has been generated for the user
	let sessionId = socket.handshake.auth.sessionId;
	if (!sessionId) {
		sessionId = uuidv4();
		// Send back a session ID to the user
		socket.emit('CONFIG:SESSION', { sessionId });
	}

	// Upsert the socket table with the sessionId
	await socketService.upsertSocket(
		socket.session.userData?.user.keycloakId!,
		sessionId
	);

	socket.handshake.auth.sessionId = sessionId;
}

/**
 * Check if incoming socket connection has a VALID JWT
 */
async function validateSocket(socket: Socket, next: (err?: Error) => void) {
	try {
		// Check if JWT exists
		const token = socket.handshake.auth.jwtToken;
		if (!token) {
			next(new Error('Authentication failed: Missing token'));
		}

		// Check if JWT is valid
		const public_key =
			'-----BEGIN PUBLIC KEY-----\n' +
			process.env.RSA256_PUBLIC_KEY +
			'\n-----END PUBLIC KEY-----';

		// Validate token
		const decoded = jwt.verify(token, public_key, {
			algorithms: ['RS256'],
		});

		const data = loadIntoSession(decoded);

		const userRow = await userService.readUserByKeycloakId(
			data.user.keycloakId
		);
		data.user.id = userRow?.id;
		socket.session = {
			userData: data,
		};

		// Is valid, continue
		next();
	} catch (error: any) {
		console.log(
			'There was an error in the incoming connection: ',
			error.message
		);
		next(new Error('Authentication failed'));
	}
}

/**
 * Store relevant information to the session
 */
function loadIntoSession(decoded: any) {
	// Update user data in local db in case there are changes
	const userData: any = {
		keycloakId: decoded.sub,
		username: decoded.preferred_username,
		email: decoded.email,
		firstName: decoded.given_name,
		lastName: decoded.family_name,
		phone: null,
		lastActivity: new Date(),
		isDeleted: 0,
	};

	// Attach User and roles onto session
	// Slap roles
	const sessionJson = {
		user: userData,
		roles: [...decoded.resource_access.client_synapse.roles],
	};

	return sessionJson;
}

function listAllRooms(io: SocketIOServer) {
	// Assuming 'io' is your Socket.IO server instance
	const rooms = io.sockets.adapter.rooms;

	// To iterate and get room names:
	for (const [roomId, roomSet] of rooms) {
		console.log(`Room ID: ${roomId}, Number of clients: ${roomSet.size}`);
	}
}
