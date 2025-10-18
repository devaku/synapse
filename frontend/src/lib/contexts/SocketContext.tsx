import { useContext, createContext, useEffect, useState } from 'react';
import { initializeSocket } from '../services/socket';
import { useAuthContext } from './AuthContext';
import type { Socket } from 'socket.io-client';

type socketContextType = {
	socket: Socket | null;
};

const SocketContext = createContext<socketContextType>({
	socket: null,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
	const { token } = useAuthContext();
	const [socket, setSocket] = useState<Socket | null>(null);
	useEffect(() => {
		if (token) {
			let socketSessionId = localStorage.getItem('SOCKET-SESSIONID');
			if (socketSessionId) {
				setSocket(initializeSocket(token, socketSessionId));
			} else {
				setSocket(initializeSocket(token));
			}
		}
	}, [token]);

	useEffect(() => {
		function onHandleSession({ sessionId }: { sessionId: string }) {
			// console.log('RECEIVED SESSION ID FOR SOCKET: ', sessionId);
			localStorage.setItem('SOCKET-SESSIONID', sessionId);
		}
		socket?.on('CONFIG:SESSION', onHandleSession);

		return () => {
			if (socket) {
				socket.off('CONFIG:SESSION', onHandleSession);
			}
		};
	}, [socket]);

	const value: socketContextType = {
		socket,
	};

	return (
		<SocketContext.Provider value={value}>
			{children}
		</SocketContext.Provider>
	);
}

export function useSocketContext() {
	return useContext(SocketContext);
}
