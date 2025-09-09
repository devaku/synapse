import HeaderContainer from '../../components/container/header_container';
import Sidebar from '../../components/container/sidebar';

export default function AccessPage() {
	return (
		<main className="flex flex-row h-screen w-full">
			<Sidebar />
			<HeaderContainer pageTitle={'Access'}>
				<div>This is the Access Page</div>
			</HeaderContainer>
		</main>
	);
}
