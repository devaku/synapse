import { useContext, createContext } from 'react';
import KeycloakJS from 'keycloak-js';
import keycloak from '../services/auth/keycloak';

type authContextType = {
	keycloak: KeycloakJS;
};

const AuthContext = createContext<authContextType>({ keycloak });

export function AuthProvider({ children }: { children: React.ReactNode }) {
	/**
	 * INTERNAL FUNCTIONS
	 */

	/**
	 * EXTERNAL FUNCTIONS
	 */

	return (
		<AuthContext.Provider value={{ keycloak }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	return useContext(AuthContext);
}
