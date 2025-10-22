import { useState, useEffect } from 'react';
import HeaderContainer from '../components/container/header_container';

export default function HomePage() {
	return (
		<HeaderContainer pageTitle="Home">
			This is the dashboard.
		</HeaderContainer>
	);
}
