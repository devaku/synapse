import { useContext, createContext } from 'react';
import { useMainAuthContext } from './MainAuthContext';

const GoogleAuthContext = createContext();

export function GoogleAuthProvider({ children }) {
	const { ENUM_INTERNAL_COOKIE, deleteCookie } = useMainAuthContext();

	function googleLogin() {
		// THESE MUST MATCH SETTING IN THE API
		// in the google cloud console
		const redirect_uri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
		const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
		const response_type = 'token';
		const prompt = 'none';
		// const access_type = 'offline';

		// Security something??? Must be random???
		const state = 'dragon';

		// SPACE DELIMETED
		// We're only grabbing scope and profile
		// https://www.googleapis.com/auth/user.phonenumbers.read
		const scope = `https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
		const url = `https://accounts.google.com/o/oauth2/v2/auth`;

		const params = new URLSearchParams({
			redirect_uri,
			client_id,
			response_type,
			// prompt,
			state,
			scope,
			// access_type,
		});

		let finalurl = `${url}?${params.toString()}`;
		// let finalurl = `http://localhost:3000`;
		window.location.href = finalurl;
	}

	function googleLogout(token) {
		return fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
			.then((response) => {
				if (response.ok) {
					console.log('Token revoked successfully.');

					// Clear the google cookie
					deleteCookie(ENUM_INTERNAL_COOKIE.GOOGLE);
					deleteCookie(ENUM_INTERNAL_COOKIE.AUTH_SERVICE);
				} else {
					console.error('Failed to revoke token.');
				}
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}

	return (
		<GoogleAuthContext.Provider value={{ googleLogin, googleLogout }}>
			{children}
		</GoogleAuthContext.Provider>
	);
}

export function useGoogleAuthContext() {
	return useContext(GoogleAuthContext);
}
