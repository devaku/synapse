import { useContext, createContext, useEffect } from 'react';
import { initializeSocket } from '../services/socket';
import { useAuthContext } from './AuthContext';
import type { Socket } from 'socket.io-client';

type socketContextType = {
	socket?: Socket;
};

const SocketContext = createContext<socketContextType>({});

export function SocketProvider({ children }: { children: React.ReactNode }) {
	const { token } = useAuthContext();
	let socket;
	useEffect(() => {
		if (token) {
			console.log('GIVEN JWT TOKEN: ', token);
			socket = initializeSocket(token);
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
