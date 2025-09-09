import Sidebar from '../../components/sidebar';
import HeaderContainer from '../../components/container/header_container';

export default function DashboardPage() {
	return (
		<main className="flex flex-row h-screen w-full">
			<Sidebar />
			<HeaderContainer pageTitle="Home">
				This is the dashboard.
			</HeaderContainer>
		</main>
	);
}
