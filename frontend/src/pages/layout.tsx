import { Outlet } from 'react-router';
import Sidebar from '../components/container/sidebar';
export default function DashboardLayout() {
	return (
		<main className="flex flex-row">
			<Sidebar />
			<Outlet></Outlet>
		</main>
	);
}
