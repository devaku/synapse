import { Outlet } from 'react-router';
import { useState, useEffect } from 'react';

/**
 * COMPONENTS
 */
import Sidebar from '../container/sidebar';
import Spinner from '../ui/spinner';
import { AuthWarningModal } from '../modals/system/authwarning_modal';

/**
 * CONTEXT / HOOKS
 */
import { useAuthContext } from '../../lib/contexts/AuthContext';
import { useModal } from '../../lib/hooks/ui/useModal';

export default function DashboardLayout() {
	const {
		isAuthenticated,
		isTokenWarning,
		token,
		parseJWT,
		refreshToken,
		keycloak,
	} = useAuthContext();

	const authWatcherModal = useModal();
	const [futureExpiration, setFutureExpiration] = useState<number>(0);

	useEffect(() => {
		if (token) {
			const jwtObject = parseJWT(token);
			setFutureExpiration(jwtObject.exp * 1000);
		}
	}, [token]);

	useEffect(() => {
		if (isTokenWarning) {
			authWatcherModal.open();
		}
	}, [isTokenWarning]);

	async function handleModalClose() {
		await refreshToken(keycloak);
		authWatcherModal.close();
	}

	return (
		<>
			{isAuthenticated ? (
				<main className="flex flex-row w-screen h-screen">
					<div className="">
						<Sidebar />
					</div>
					<div className="w-full bg-ttg-white">
						<Outlet></Outlet>
					</div>
					<AuthWarningModal
						isOpen={authWatcherModal.isOpen}
						futureTime={futureExpiration}
						handleModalToggle={handleModalClose}
					></AuthWarningModal>
				</main>
			) : (
				<Spinner></Spinner>
			)}
		</>
	);
}
