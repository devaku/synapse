import HeaderContainer from '../../components/container/header_container';
import Sidebar from '../../components/container/sidebar';

export default function SettingsPage() {
	return (
		<main className="flex flex-row h-screen w-full">
			<Sidebar />
			<HeaderContainer pageTitle={'Settings'}>
				<div>This is the Settings Page</div>
			</HeaderContainer>
		</main>
	);
}
