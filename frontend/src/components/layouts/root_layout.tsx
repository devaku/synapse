import { Outlet } from 'react-router';
import { AuthProvider } from '../../lib/contexts/AuthContext';

export default function RootLayout() {
	return (
		<>
			<AuthProvider>
				<Outlet></Outlet>
			</AuthProvider>
		</>
	);
}
