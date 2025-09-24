import { Outlet } from 'react-router';
import { AuthProvider } from '../../lib/contexts/AuthContext';
import { SocketProvider } from '../../lib/contexts/SocketContext';

export default function ProtectLayout() {
	return (
		<>
			<AuthProvider>
				<SocketProvider>
					<Outlet></Outlet>
				</SocketProvider>
			</AuthProvider>
		</>
	);
}
