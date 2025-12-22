import type { jsonResponse } from '../../types/custom';
import { API_URL } from '../../env-variables';

const url = API_URL;

export async function getGithubRepos(token?: string) {
	const endpoint = `${url}/github-repos`;

	let res: Response;
	try {
		res = await fetch(endpoint, {
			method: 'GET',
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			credentials: 'include',
		});
	} catch (error) {
		console.error('Network fetch error:', error);
		// network error
		throw new Error('Network error while fetching GitHub repositories');
	}

	const contentType = (res.headers.get('content-type') || '').toLowerCase();

	// If non-OK status, attempt to read body (json or text) and throw clear error
	if (!res.ok) {
		let bodyText: string | undefined;
		try {
			if (contentType.includes('application/json')) {
				const parsed = await res.json();
				bodyText = parsed && typeof parsed === 'object' ? parsed.message || JSON.stringify(parsed) : String(parsed);
			} else {
				bodyText = await res.text();
			}
		} catch (e) {
			bodyText = `HTTP ${res.status} ${res.statusText}`;
		}
		console.error('API error fetching repos:', res.status, bodyText);
		throw new Error(bodyText || `HTTP ${res.status}`);
	}

	// OK response: only parse JSON when content-type indicates JSON
	if (contentType.includes('application/json')) {
		let parsed: any;
		try {
			parsed = await res.json();
		} catch (e) {
			console.error('Failed to parse JSON response for github-repos:', e);
			throw new Error('Invalid JSON returned from server');
		}

		if (!parsed) return [];
		if (Array.isArray(parsed)) return parsed;
		if (parsed.repositories) return parsed.repositories;
		if (parsed.data) return parsed.data;
		return parsed;
	}

	// If server returned non-JSON but 200 OK (unlikely), read text for debugging
	try {
		const text = await res.text();
		console.warn('Received non-JSON response for github-repos:', text);
	} catch (e) {
		/* ignore */
	}
	return [];
}

export async function createRepoCollaboratorRequest(
	token: string,
	body: Record<string, any>
) {
	const res = await fetch(`${url}/repo-requests`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		},
		credentials: 'include',
		body: JSON.stringify(body),
	}).catch((error) => {
		console.error('Fetch error:', error);
		throw new Error('Network error while creating request');
	});

	// Try to parse JSON body if available, otherwise fallback to text
	let parsed: any;
	try {
		parsed = await res.json();
	} catch (err) {
		try {
			parsed = await res.text();
		} catch (e) {
			parsed = undefined;
		}
	}

	if (!res.ok) {
		const msg =
			parsed && typeof parsed === 'object'
				? parsed.message || JSON.stringify(parsed)
				: parsed || res.statusText;
		throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
	}

	if (parsed && parsed.data) return parsed.data;
	// If backend returned a wrapper with statusCode/message but no data, return empty array
	if (
		parsed &&
		typeof parsed === 'object' &&
		('statusCode' in parsed || 'message' in parsed)
	)
		return [];
	return parsed || [];
}

export async function readRepoCollaboratorRequest(
	token?: string,
	id?: number,
	query?: Record<string, string | number>
) {
	let endpoint = `${url}/repo-requests`;
	if (typeof id === 'number') endpoint = `${endpoint}/${id}`;
	if (query) {
		const params = new URLSearchParams(
			Object.entries(query).map(([k, v]) => [k, String(v)]) as any
		).toString();
		endpoint = `${endpoint}?${params}`;
	}

	const res = await fetch(endpoint, {
		method: 'GET',
		headers: token ? { Authorization: `Bearer ${token}` } : {},
		credentials: 'include',
	}).catch((error) => {
		console.error('Fetch error:', error);
		throw new Error('Network error while reading requests');
	});

	let parsed: any;
	try {
		parsed = await res.json();
	} catch (e) {
		try {
			parsed = await res.text();
		} catch (e2) {
			parsed = undefined;
		}
	}

	if (!res.ok) {
		const msg =
			parsed && typeof parsed === 'object'
				? parsed.message || JSON.stringify(parsed)
				: parsed || res.statusText;
		throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
	}

	if (parsed && parsed.data) return parsed.data;
	return parsed || [];
}

export async function addUserToRepo(
	token: string,
	repoId: number,
	githubUsername: string,
	permission: string
) {
	const body = { githubUsername, permission };
	const response: jsonResponse | undefined = await fetch(
		`${url}/github-repos/${repoId}/collaborators`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			credentials: 'include',
			body: JSON.stringify(body),
		}
	)
		.then((res) => res.json())
		.catch((error) => {
			console.error('Fetch error:', error);
			return undefined;
		});

	if (response && (response as any).data) return (response as any).data;
	return response || [];
}

export async function deleteRepoCollaboratorRequest(
	token: string,
	id?: number,
	requestIdArray?: number[]
) {
	let endpoint = `${url}/repo-requests`;
	let options: RequestInit = {
		method: 'DELETE',
		headers: token
			? {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				}
			: { 'Content-Type': 'application/json' },
		credentials: 'include',
	};

	if (typeof id === 'number') {
		endpoint = `${endpoint}/${id}`;
		// No body required for single-delete
	} else if (Array.isArray(requestIdArray)) {
		options = {
			...options,
			body: JSON.stringify({ requestIdArray }),
		};
	}

	const response = await fetch(endpoint, options)
		.then((res) => res.json())
		.catch((error) => {
			console.error('Fetch error:', error);
			return undefined;
		});

	if (!response) return [];
	if ((response as any).data) return (response as any).data;
	return response;
}
