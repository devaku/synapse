import { Outlet } from 'react-router';
import Sidebar from '../container/sidebar';
import { useAuthContext } from '../../lib/contexts/AuthContext';
import Spinner from '../ui/spinner';
export default function DashboardLayout() {
	const { isAuthenticated } = useAuthContext();
	return (
		<>
			{isAuthenticated ? (
				<main className="flex flex-row w-screen h-screen">
					<div className="">
						<Sidebar />
					</div>
					<div className="w-full">
						<Outlet></Outlet>
					</div>
				</main>
			) : (
				<Spinner></Spinner>
			)}
		</>
	);
}
