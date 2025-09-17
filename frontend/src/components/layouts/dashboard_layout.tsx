import { Outlet } from 'react-router';
import Sidebar from '../container/sidebar';
export default function DashboardLayout() {
	return (
		<main className="flex flex-row w-screen h-screen">
			<div className="">
				<Sidebar />
			</div>
			<div className="w-full">
				<Outlet></Outlet>
			</div>
		</main>
	);
}
