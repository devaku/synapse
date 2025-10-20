import type { jsonResponse } from '../../types/custom';
const url = import.meta.env.VITE_API_URL;

export async function getGithubRepos(token?: string) {
    const response: jsonResponse | Record<string, any> | undefined = await fetch(`${url}/github-repos`, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
    })
        .then((res) => res.json())
        .catch((error) => {
            console.error('Fetch error:', error);
            return undefined;
        });

    if (!response) return [];

    // If backend forwarded the raw GitHub payload
    if ((response as any).repositories) return (response as any).repositories;

    // If backend uses wrapper { statusCode, data }
    if ((response as any).data) return (response as any).data;

    return response;
}

export async function createRepoCollaboratorRequest(token: string, body: Record<string, any>) {
    const response: jsonResponse | undefined = await fetch(`${url}/repo-requests`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(body),
    })
        .then((res) => res.json())
        .catch((error) => {
            console.error('Fetch error:', error);
            return undefined;
        });

    // If the backend returns an error wrapper like { statusCode, message }, surface it as an exception
    if (response && (response as any).statusCode && (response as any).statusCode >= 400) {
        const msg = (response as any).message || 'Server returned an error';
        throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }

    if (response && (response as any).data) return (response as any).data;
    // fallback: return raw response or empty array
    return response || [];
}

export async function readRepoCollaboratorRequest(token?: string, id?: number, query?: Record<string, string | number>) {
    let endpoint = `${url}/repo-requests`;
    if (typeof id === 'number') endpoint = `${endpoint}/${id}`;
    if (query) {
        const params = new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)]) as any).toString();
        endpoint = `${endpoint}?${params}`;
    }

    const response: jsonResponse | Record<string, any> | undefined = await fetch(endpoint, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
    })
        .then((res) => res.json())
        .catch((error) => {
            console.error('Fetch error:', error);
            return undefined;
        });

    if (!response) return [];
    if ((response as any).data) return (response as any).data;
    return response;
}

export async function addUserToRepo(token: string, repoId: number, githubUsername: string, permission: string) {
    const body = { githubUsername, permission };
    const response: jsonResponse | undefined = await fetch(`${url}/github-repos/${repoId}/collaborators`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(body),
    })
        .then((res) => res.json())
        .catch((error) => {
            console.error('Fetch error:', error);
            return undefined;
        });

    if (response && (response as any).data) return (response as any).data;
    return response || [];
}

export async function deleteRepoCollaboratorRequest(token: string, id?: number, requestIdArray?: number[]) {
    let endpoint = `${url}/repo-requests`;
    let options: RequestInit = {
        method: 'DELETE',
        headers: token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' },
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
