import { useContext, createContext } from 'react';

const MainAuthContext = createContext();

/**
 * Add the revoking of token
 * add composer layout
 * test integration with electron
 */

export function MainAuthProvider({ children }) {
	/**
	 * INTERNAL FUNCTIONS
	 */

	/**
	 * Get the cookie associated with the given variable name
	 * @param {string} name
	 * @returns string
	 */
	function getCookie(name) {
		// Create the search string for the cookie name
		const nameEQ = name + '=';

		// Split the document.cookie string into an array of individual cookie strings
		const ca = document.cookie.split(';');

		// Loop through the array of cookie strings
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			// Trim any leading whitespace from the cookie string
			while (c.charAt(0) === ' ') {
				c = c.substring(1, c.length);
			}
			// If the cookie string starts with the desired name, extract and return its value
			if (c.indexOf(nameEQ) === 0) {
				return decodeURIComponent(c.substring(nameEQ.length, c.length));
			}
		}
		// Return null if the cookie is not found
		return null;
	}

	/**
	 * Parse the cookie string into an object
	 * @param {string} cookieString
	 * @returns object
	 */
	function parseCookieString(cookieString) {
		const cookies = cookieString.split('; ');
		const cookieObj = {};

		cookies.forEach((cookie) => {
			const [name, ...rest] = cookie.split('=');
			cookieObj[decodeURIComponent(name)] = decodeURIComponent(
				rest.join('=')
			);
		});

		return cookieObj;
	}

	/**
	 * EXTERNAL FUNCTIONS
	 */

	const ENUM_INTERNAL_COOKIE = {
		AUTH_SERVICE: 'AUTH_SERVICE',
		DJANGO_ACCESS_TOKEN: 'DJANGO_ACCESS_TOKEN',
		DJANGO_REFRESH_TOKEN: 'DJANGO_REFRESH_TOKEN',
		GOOGLE: 'GOOGLE_ACCESS_TOKEN',
		USER_ID: 'USER_ID',
	};

	const ENUM_AUTH_SERVICES = {
		DJANGO: 'DJANGO',
		GOOGLE: 'GOOGLE',
	};

	/**
	 * Convert the given variable into a UTC String
	 * @param {number} seconds
	 * @returns String
	 */
	function formatIntoUTC(seconds) {
		const currentDate = new Date();
		currentDate.setSeconds(currentDate.getSeconds() + seconds);
		// Normal, relative date
		// console.log(currentDate.toString());

		return currentDate.toUTCString();
	}

	/**
	 * Read the current AUTH SERVICE
	 * the user is logged into
	 * @returns String
	 */
	function readAuthService() {
		let authService = getCookie(ENUM_INTERNAL_COOKIE.AUTH_SERVICE);
		return authService;
	}

	/**
	 * Read the current access token
	 * associated with the user's auth
	 * @returns String
	 */
	function readAccessToken() {
		let givenAuthService = readAuthService();
		// console.log('GIVEN AUTH SERVICE:', givenAuthService);
		let token = getCookie(ENUM_INTERNAL_COOKIE[givenAuthService]);
		// console.log('TOKEN: ', token);

		return token;
	}

	/**
	 * Set a cookie in the browser
	 * @param {string} cookieName
	 * @param {string} cookieValue
	 * @param {string} expirationInUTC
	 * @param {string} path
	 */
	function setCookie(cookieName, cookieValue, expirationInUTC, path) {
		document.cookie = `${cookieName}=${cookieValue}; max-age=${expirationInUTC}; path=${path}`;
	}

	/**
	 * Delete a cookie based on the given cookie name
	 * @param {string} cookieName
	 */
	function deleteCookie(cookieName) {
		setCookie(cookieName, '', -1, '/');
	}

	/**
	 * Set the necessary cookies in the browser
	 * @param {string} user_id
	 * @param {string} access_token
	 * @param {string} refresh_token
	 */
	function loginSetCookies(user_id, access_token, refresh_token) {
		// Fixed expiration
		const expire = 604800;

		// Set the auth service
		setCookie(
			ENUM_INTERNAL_COOKIE.AUTH_SERVICE,
			ENUM_AUTH_SERVICES.DJANGO,
			expire,
			'/'
		);

		setCookie(ENUM_INTERNAL_COOKIE.USER_ID, user_id, expire, '/');

		// Set the tokens
		setCookie(
			ENUM_INTERNAL_COOKIE.DJANGO_REFRESH_TOKEN,
			refresh_token,
			expire,
			'/'
		);
		setCookie(
			ENUM_INTERNAL_COOKIE.DJANGO_ACCESS_TOKEN,
			access_token,
			expire,
			'/'
		);
	}

	function logoutRemoveCookies() {
		deleteCookie(ENUM_INTERNAL_COOKIE.DJANGO_ACCESS_TOKEN);
		deleteCookie(ENUM_INTERNAL_COOKIE.DJANGO_REFRESH_TOKEN);
		deleteCookie(ENUM_INTERNAL_COOKIE.USER_ID);
		deleteCookie(ENUM_INTERNAL_COOKIE.AUTH_SERVICE);
	}

	return (
		<MainAuthContext.Provider
			value={{
				ENUM_INTERNAL_COOKIE,
				ENUM_AUTH_SERVICES,
				setCookie,
				deleteCookie,
				loginSetCookies,
				logoutRemoveCookies,
				readAuthService,
				formatIntoUTC,
				readAccessToken,
			}}
		>
			{children}
		</MainAuthContext.Provider>
	);
}

export function useMainAuthContext() {
	return useContext(MainAuthContext);
}
