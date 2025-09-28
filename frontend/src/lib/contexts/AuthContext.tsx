import { useContext, useEffect, useState, createContext } from 'react';

import keycloak from '../services/auth/keycloak';

type authContextType = {
	keycloak: typeof keycloak;
	isAuthenticated: boolean;
	token: string | null;
};

const AuthContext = createContext<authContextType>({
	keycloak,
	isAuthenticated: false,
	token: '',
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

	const value: authContextType = {
		keycloak,
		isAuthenticated,
		token,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuthContext() {
	return useContext(AuthContext);
}
