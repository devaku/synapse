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
import { ErrorProvider } from '../../lib/contexts/ErrorContext';
import { useModal } from '../../lib/hooks/ui/useModal';
import { SoundProvider } from '../../lib/contexts/SoundContext';
import { ErrorWarningModal } from '../modals/system/errorwarning_modal';

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
	const errorWarningModal = useModal();
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

	

	return (
		<>
			<SoundProvider>
				<ErrorProvider>
					{isAuthenticated ? (
						<main className="flex flex-row h-screen">
							<div className="">
								<Sidebar />
							</div>
							<div className="w-full bg-ttg-white">
								<Outlet></Outlet>
							</div>
							{/* <AuthWarningModal
							isOpen={authWatcherModal.isOpen}
							futureTime={futureExpiration}
							handleModalToggle={handleModalClose}
						></AuthWarningModal> */}
							<ErrorWarningModal
								isOpen={errorWarningModal.isOpen}
								open={errorWarningModal.open}
								close={errorWarningModal.close}
							/>
						</main>
					) : (
						<Spinner></Spinner>
					)}
				</ErrorProvider>
			</SoundProvider>
		</>
	);
}
