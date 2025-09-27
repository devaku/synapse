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
			// console.log('GIVEN JWT TOKEN: ', token);
			setSocket(initializeSocket(token));
		}
	}, [token]);

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
