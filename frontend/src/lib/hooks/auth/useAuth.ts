import { useState, useEffect } from 'react';
import keycloak from '../../services/auth/keycloak';

const UNUSED_useAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false); // tracking auth status
	const [token, setToken] = useState<string | null>(null);
	useEffect(() => {
		if (keycloak.didInitialize) {
			return;
		} else {
			keycloak
				.init({ onLoad: 'login-required' }) // or "check-sso"
				.then((res) => {
					// console.log(res);
					setIsAuthenticated(res);
					if (keycloak.token) {
						// console.log(keycloak.token);
						// storing access token after successful login
						setToken(keycloak.token);
					}
				})
				.catch((error) => {
					console.error(
						'Error during Keycloak initialization:',
						error
					);
				});
		}
	}, []);
	return { keycloak, isAuthenticated, token };
};

export default UNUSED_useAuth;
