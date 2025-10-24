import { useState, useEffect } from 'react';
import { useNotifications } from '../lib/hooks/api/useNotifications';
import { useAudio } from '../lib/hooks/ui/useAudio';

import HeaderContainer from '../components/container/header_container';

export default function HomePage() {
	const { debugPlayNotification } = useNotifications();

	return (
		<HeaderContainer pageTitle="Home">
			This is the dashboard.
		</HeaderContainer>
	);
}
