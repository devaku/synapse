import { useMainAuthContext } from '../../../lib/contexts/MainAuthContext';
import { LoginGoogleUser } from '../../../lib/services/user/auth_api';
import { useNavigate } from 'react-router';

export default function GoogleCallbackPage() {
	const navigate = useNavigate();
	const {
		ENUM_INTERNAL_COOKIE,
		ENUM_AUTH_SERVICES,
		loginSetCookies,
		setCookie,
		formatIntoUTC,
	} = useMainAuthContext();

	async function parseGoogleAuthResponse() {
		try {
			// SAMPLE RECEIVED RESPONSE:
			// If success
			// http://localhost:3000/auth/google/callback#state=dragon&access_token=ya29.&token_type=Bearer&expires_in=3599&scope=email profile openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email&authuser=1&prompt=consent

			// If denied
			// http://localhost:3000/auth/callback/google#error=access_denied&state=dragon

			// Parse the fragment
			const fragment = window.location.hash.substring(1); // removes the #
			const params = new URLSearchParams(fragment);

			// Extract values
			const accessToken = params.get('access_token');
			const tokenType = params.get('token_type');
			const expiresIn = params.get('expires_in');
			const error = params.get('error');

			if (error) {
				// Do nothing
				// Redirect to Dashboard
				navigate('/');
			} else {
				// Log the user in the backend
				let response = await LoginGoogleUser(accessToken);

				// Convert the time
				// Fixed expiration
				const expire = '604800';

				let user_id = response.user_id;
				let access_token = response.access;
				let refresh_token = response.refresh;
				loginSetCookies(user_id, access_token, refresh_token);

				// Set the auth service to be for google
				setCookie(
					ENUM_INTERNAL_COOKIE.AUTH_SERVICE,
					ENUM_AUTH_SERVICES.GOOGLE,
					expire,
					'/'
				);

				// Redirect to Dashboard
				navigate('/dashboard');
			}
		} catch (error) {
			console.log('There was an error in logging in via google!');

			// Redirect back to login page
			window.location.href = 'http://localhost:3000';
		}
	}

	parseGoogleAuthResponse();
	return <></>;
}
