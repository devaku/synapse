import { Outlet } from 'react-router';

export default function RootLayout() {
	//TODO: This needs to be converted to a composer provider
	return (
		<>
			<Outlet></Outlet>
			{/* <MainAuthProvider>
				<GoogleAuthProvider>
				
				</GoogleAuthProvider>
			</MainAuthProvider> */}
		</>
	);
}
