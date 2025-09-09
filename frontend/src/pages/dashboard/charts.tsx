import HeaderContainer from '../../components/container/header_container';
import Sidebar from '../../components/container/sidebar';

export default function ChartsPage() {
	return (
		<main className="flex flex-row h-screen w-full">
			<Sidebar />
			<HeaderContainer pageTitle={'Charts'}>
				<div>This is the Charts Page</div>
			</HeaderContainer>
		</main>
	);
}
