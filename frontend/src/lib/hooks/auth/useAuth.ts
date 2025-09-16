import { useState, useEffect, useRef } from 'react';
import keycloak from '../../services/auth/keycloak';

const useAuth = () => {
	const isRun = useRef(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false); // tracking auth status
	const [token, setToken] = useState<string | null>(null);
	useEffect(() => {
		if (isRun.current) {
			return;
		} // Ensures init only runs once
		isRun.current = true;
		keycloak
			.init({ onLoad: 'login-required' }) // or "check-sso"
			.then((res) => {
				console.log(res);
				setIsAuthenticated(res);
				if (keycloak.token) {
					console.log(keycloak.token);
					setToken(keycloak.token); // storing access token after successful login
				}
			})
			.catch((error) => {
				console.error('Error during Keycloak initialization:', error);
			});
	}, []);
	return { isAuthenticated, token };
};

export default useAuth;
