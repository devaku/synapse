/**
 * Register a user in the database
 * @param {*} param0
 */
export async function RegisterUser({
	first_name,
	last_name,
	email,
	phone,
	role,
	username,
	password,
}) {
	let data = {
		first_name,
		last_name,
		email,
		phone: '',
		role,
		password,
		username,
	};
	let url = import.meta.env.VITE_DJANGO_BACKEND_URL;

	// Sample response:
	/**
	 * {
		user_id: 3,
		refresh:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NTE3NzMzMSwiaWF0IjoxNzU1MDkwOTMxLCJqdGkiOiI4Zjg2ZjU5MDI1NWM0NGY4YTBiNDQ2YWZhNjA0OTkyMSIsInVzZXJfaWQiOiIzIn0.ts76PRDawEvsJK08bH2uA__FjYpDeYQgl4JSDbkGFRA',
		access: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1MDkxMjMxLCJpYXQiOjE3NTUwOTA5MzEsImp0aSI6IjBmMDI2ZGUyZjI2NDQwNzNiZDI0NzVjMWQ3MGNkYWE2IiwidXNlcl9pZCI6IjMifQ.cQr5tyFl6pIQIy9YmiUFiIhozAOP9UTIIIFeV97_kUY',
	};
	 */

	let response = await fetch(`${url}/api/auth/register/`, {
		method: 'POST',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then((res) => res.json())
		.catch((error) => {
			console.error('Fetch error:', error);
		});

	return response;
}

export async function ReadUser(email) {
	// Refer to sample JSON
	let response = await fetch(`${url}/auth/user`, {
		method: 'POST',
		body: JSON.stringify(data),
	})
		.then((res) => res.json())
		.catch((error) => {
			console.error('Fetch error:', error);
		});
}
