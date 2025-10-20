import { useContext, useEffect, useState, createContext } from 'react';

import keycloak from '../services/auth/keycloak';
import { type keycloakUserData } from '../types/custom';
import type { User } from '../types/models';

import { readUser } from '../services/api/user';

type authContextType = {
	keycloak: typeof keycloak;
	isAuthenticated: boolean;
	token: string | null;
	userData: Partial<keycloakUserData>;
	serverData: Partial<User>;
};

const AuthContext = createContext<authContextType>({
	keycloak,
	isAuthenticated: false,
	token: '',
	userData: {},
	serverData: {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false); // tracking auth status
	const [token, setToken] = useState<string | null>(null);
	const [userData, setUserData] = useState<Partial<keycloakUserData>>({});
	const [serverData, setServerData] = useState<Partial<User>>({});

	useEffect(() => {
		async function start() {
			if (keycloak.didInitialize) {
				return;
			} else {
				try {
					const res = await keycloak.init({
						onLoad: 'login-required',
					}); // or "check-sso"

					// console.log(res);
					setIsAuthenticated(res);
					if (keycloak.token) {
						// console.log(keycloak.token);
						// storing access token after successful login
						setToken(keycloak.token);
						let jwtData = parseJWT(keycloak.token);
						setUserData(jwtData);

						// Fetch data from the server
						let temp = await readUser(keycloak.token, jwtData.sub);
						setServerData(temp[0]);
					}
				} catch (error: any) {
					console.error(
						'Error during Keycloak initialization:',
						error
					);
				}
			}
		}

		start();
	}, []);

	const value: authContextType = {
		keycloak,
		isAuthenticated,
		token,
		userData,
		serverData,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuthContext() {
	return useContext(AuthContext);
}

function parseJWT(token: string) {
	let base64Url = token.split('.')[1];
	let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	let jsonPayload = decodeURIComponent(
		window
			.atob(base64)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join('')
	);

	// console.log(jsonPayload);

	return JSON.parse(jsonPayload);
}
