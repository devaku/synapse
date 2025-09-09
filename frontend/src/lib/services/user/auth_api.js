/**
 * Logs a user into the backend via Google
 * @param {string} access_token
 * @returns string
 */
export async function LoginGoogleUser(access_token) {
	let data = {
		access_token,
	};

	/**
     * {
    "user_id": 2,
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTE4MjM0NiwiaWF0IjoxNzU1MDk1OTQ2LCJqdGkiOiJhNTNiYmJiMTMxZGY0MzRhYjU5M2EyODNkMWFhZTdmOCIsInVzZXJfaWQiOiIyIn0.RXEYxJQ74iB-wAuOFuhi6lqtvanH5599gsTp_kMl2_w",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1MDk2MjQ2LCJpYXQiOjE3NTUwOTU5NDYsImp0aSI6ImU0NjdlOTBjOWEwNDQ1MjI5Y2MyNjBkZWY2OTUyZjI1IiwidXNlcl9pZCI6IjIifQ.k4rhZq8HiL9GdmSdc1mf7La_N8HWGU5eivYVJfT4SYk",
    "user": {
        "id": 2,
        "username": "alejo_kim",
        "email": "alejokimuy@gmail.com",
        "first_name": "Alejo Kim",
        "last_name": "Uy"
    }
}
     */
	let url = import.meta.env.VITE_DJANGO_BACKEND_URL;

	let response = await fetch(`${url}/api/auth/google/`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'same-origin',
		body: JSON.stringify(data),
	})
		.then((res) => res.json())
		.catch((error) => {
			console.error('Fetch error:', error);
		});

	return response;
}

/**
 * Logs a user in via email / password
 * @param {string} accessToken
 * @returns string
 */
export async function LoginEmailPassword(email, password) {
	let data = {
		email,
		password,
	};
	let url = import.meta.env.VITE_DJANGO_BACKEND_URL;

	// Refer to sample JSON
	/**
     * 
        {
            "user_id": 4,
            "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTE4MTI4MSwiaWF0IjoxNzU1MDk0ODgxLCJqdGkiOiJkMWEyMGUwYzI5OGU0ZDE2Yjk3Zjg0NTljMGM1MWJhZCIsInVzZXJfaWQiOiI0In0.Q0Skji7ZFecFPWyepsMoj9f1ygBy3f4v9Sb9Kdp25nU",
            "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1MDk1MTgxLCJpYXQiOjE3NTUwOTQ4ODEsImp0aSI6IjQyNzU3NDVkMDQ4NDQwMDliM2UzYjc3NmQxMmIxOWUzIiwidXNlcl9pZCI6IjQifQ.vNokasYPqAUcjEKkVv--l1ZksoJtxMaw92wAqeje0N8"
        }
     */
	let response = await fetch(`${url}/api/auth/login/`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'same-origin',
		body: JSON.stringify(data),
	})
		.then((res) => res.json())
		.catch((error) => {
			console.error('Fetch error:', error);
		});

	return response;
}
