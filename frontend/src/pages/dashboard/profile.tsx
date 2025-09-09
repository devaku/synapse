import HeaderContainer from '../../components/container/header_container';
import Sidebar from '../../components/container/sidebar';

export default function ProfilePage() {
	return (
		<main className="flex flex-row h-screen w-full">
			<Sidebar />
			<HeaderContainer pageTitle={'Profile'}>
				<div>This is the Profile Page</div>
			</HeaderContainer>
		</main>
	);
}
