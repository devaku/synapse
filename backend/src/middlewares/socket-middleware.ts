import { Socket, Server as SocketIOServer } from 'socket.io';
import type { Server as HttpServer } from 'http';

export function socketMiddleware(httpServer: HttpServer) {
	const io = new SocketIOServer(httpServer, {
		cors: {
			origin: 'http://localhost:3000',
		},
	});
	io.on('connection', (socket: Socket) => {
		console.log(
			'Socket connected! AUTH: ',
			JSON.stringify(socket.handshake.auth)
		);

		// socket.emit('DEBUG:PING', {
		// 	message: 'This is from the synapse server',
		// });

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
