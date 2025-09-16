import { Outlet } from 'react-router';

export default function ProtectLayout() {
	return (
		<>
			<Outlet></Outlet>
		</>
	);
}
