import { SOCKET_URL } from '../env-variables';

const socketUrl = SOCKET_URL;
import { io, Socket } from 'socket.io-client';

let internalSocket: Socket;

export function initializeSocket(jwtToken: string | null, sessionId?: string) {
	if (!internalSocket) {
		internalSocket = io(SOCKET_URL, {
			auth: {
				jwtToken,
				sessionId,
			},
		});
	}
	return internalSocket;
}
