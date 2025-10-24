import { useState, useEffect } from 'react';
import { useNotifications } from '../lib/hooks/api/useNotifications';
import HeaderContainer from '../components/container/header_container';

export default function HomePage() {
	const { debugPlayNotification } = useNotifications();

	return (
		<HeaderContainer pageTitle="Home">
			This is the dashboard.
			<div>
				<button
					onClick={() => {
						debugPlayNotification();
					}}
					className="p-2 bg-sky-500 cursor-pointer"
				>
					PLAY
				</button>
			</div>
		</HeaderContainer>
	);
}
