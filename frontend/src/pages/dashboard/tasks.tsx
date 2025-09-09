import HeaderContainer from '../../components/container/header_container';
import Sidebar from '../../components/container/sidebar';

export default function TasksPage() {
	return (
		<main className="flex flex-row h-screen w-full">
			<Sidebar />
			<HeaderContainer pageTitle={'Tasks'}>
				<div>This is the Tasks Page</div>
			</HeaderContainer>
		</main>
	);
}
