import { Outlet } from 'react-router';

export default function DebugLayout() {
	return (
		<>
			<Outlet></Outlet>
			{/* <GoogleOAuthProvider
				clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
				// onScriptLoadError={() => {
				// 	console.log('Script load error');
				// }}
				// onScriptLoadSuccess={() => {
				// 	console.log('SCRIPT SUCCESS');
				// }}
			>
		
			</GoogleOAuthProvider> */}
		</>
	);
}
