import { Outlet } from 'react-router';
import { AuthProvider } from '../../lib/contexts/AuthContext';

export default function ProtectLayout() {
	return (
		<>
			<AuthProvider>
				<Outlet></Outlet>
			</AuthProvider>
		</>
	);
}
