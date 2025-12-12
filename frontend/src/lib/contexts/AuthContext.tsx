import { useContext, useEffect, useState, createContext } from 'react';

import keycloak from '../services/auth/keycloak';
import { formatDate } from '../helpers/datehelpers';
import { type keycloakUserData } from '../types/custom';
import type { User } from '../types/models';

import { readUser } from '../services/api/user';

type authContextType = {
	keycloak: typeof keycloak;
	token: string | null;
	userData: Partial<keycloakUserData>;
	serverData: Partial<User>;
	isAuthenticated: boolean;
	isTokenExpired: boolean;
	isTokenWarning: boolean;
	parseJWT: (token: string) => any;
	refreshToken: (kc: typeof keycloak) => Promise<void>;
};

const AuthContext = createContext<authContextType>({
	keycloak,
	isAuthenticated: false,
	token: '',
	userData: {},
	serverData: {},
	isTokenExpired: false,
	isTokenWarning: false,
	parseJWT: (token: string) => '',
	refreshToken: async (kc: typeof keycloak) => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false); // tracking auth status
	const [token, setToken] = useState<string | null>(null);
	const [userData, setUserData] = useState<Partial<keycloakUserData>>({});
	const [serverData, setServerData] = useState<Partial<User>>({});
	const [isTokenExpired, setIsTokenExpired] = useState<boolean>(false);
	const [isTokenWarning, setIsTokenWarning] = useState<boolean>(false);

	useEffect(() => {
		async function start() {
			if (keycloak.didInitialize) {
				return;
			} else {
				try {
					keycloakEventHandler(keycloak);

					await keycloak.init({
						onLoad: 'login-required',
					});
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

	// Whenever a token is refereshed, reset the timer
	useEffect(() => {
		if (token) {
			let jwtData = parseJWT(token);

			const expiration = new Date(jwtData.exp * 1000);

			// Set time to run 3 minutes before expiration time
			const warningTime = subtractMinutes(expiration, 3);
			const millisecondDifference =
				expiration.getTime() - warningTime.getTime();
			const timerId = setTimeout(() => {
				setIsTokenWarning(true);
			}, millisecondDifference);

			return () => {
				clearTimeout(timerId);
			};
		}
	}, [token]);

	function keycloakEventHandler(kc: typeof keycloak) {
		kc.onReady = async (isAuthenticated) => {
			if (isAuthenticated !== undefined) {
				setIsAuthenticated(isAuthenticated);
				if (kc.token) {
					// storing access token after successful login
					setToken(kc.token);

					let jwtData = parseJWT(kc.token);
					const expiration = formatDate(new Date(jwtData.exp * 1000));
					setUserData(jwtData);

					// Fetch data from the server
					let temp = await readUser(kc.token, jwtData.sub);
					setServerData(temp[0]);
				}
			}
		};

		kc.onTokenExpired = async () => {
			await keycloakRefreshToken(kc);
		};
	}

	async function keycloakRefreshToken(kc: typeof keycloak) {
		await kc.updateToken(-1);
		setToken(kc.token!);

		let jwtData = parseJWT(kc.token!);
		const expiration = formatDate(new Date(jwtData.exp * 1000));
		// console.log('NEW EXPIRATION: ', expiration);
		// setIsTokenExpired(false);
		// setIsTokenWarning(false);
	}

	function parseJWT(token: string) {
		let base64Url = token.split('.')[1];
		let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		let jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split('')
				.map(function (c) {
					return (
						'%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
					);
				})
				.join('')
		);

		// console.log(jsonPayload);

		return JSON.parse(jsonPayload);
	}

	const value: authContextType = {
		keycloak,
		isAuthenticated,
		token,
		userData,
		serverData,
		isTokenExpired,
		isTokenWarning,
		parseJWT,
		refreshToken: keycloakRefreshToken,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

function convertSecondsToMilliseconds(seconds) {
	return seconds * 1000;
}

export function useAuthContext() {
	return useContext(AuthContext);
}

function subtractMinutes(date, minutes) {
	const newDate = new Date(date); // Create a new Date object to avoid modifying the original
	newDate.setMinutes(newDate.getMinutes() - minutes);
	return newDate;
}
