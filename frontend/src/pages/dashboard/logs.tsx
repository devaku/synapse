import HeaderContainer from '../../components/container/header_container';
import Sidebar from '../../components/container/sidebar';

export default function LogsPage() {
	return (
		<main className="flex flex-row h-screen w-full">
			<Sidebar />
			<HeaderContainer pageTitle={'Logs'}>
				<div>This is the Logs Page</div>
			</HeaderContainer>
		</main>
	);
}
