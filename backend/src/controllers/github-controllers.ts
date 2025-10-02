import express from "express";
import { Request, Response } from 'express';
import { createGithubAppJwt, getInstallationAccessToken } from "../lib/github-app-auth";
import { addUserToRepo as addUserToRepoService } from "../services/github-services";
import * as githubService from "../services/github-services";
import { buildResponse, buildError } from '../lib/response-helper';
import axios from "axios";

const app = express();


/**
 * Controller to get gihub repositories information from the organization  
 *    
 * @param req - Request object containing a team object
 * @param res - Response Object
 *
 * @returns A JSON response with the repository information, 
 * example response:
 *{
    "total_count": 1,
    "repository_selection": "selected",
    "repositories": [
        {
            "id": 1067339301,
            "node_id": "R_kgDOP55OJQ",
            "name": "normal-private-repo",
            "full_name": "capstone-SuperTest/normal-private-repo",
            "private": true,
            "owner": {
                "login": "capstone-SuperTest",
                "id": 235366611,
                "node_id": "O_kgDODgdo0w",
                "avatar_url": "https://avatars.githubusercontent.com/u/235366611?v=4",
                "gravatar_id": "",
                "url": "https://api.github.com/users/capstone-SuperTest",
                "html_url": "https://github.com/capstone-SuperTest",
                "followers_url": "https://api.github.com/users/capstone-SuperTest/followers",
                "following_url": "https://api.github.com/users/capstone-SuperTest/following{/other_user}",
                "gists_url": "https://api.github.com/users/capstone-SuperTest/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/capstone-SuperTest/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/capstone-SuperTest/subscriptions",
                "organizations_url": "https://api.github.com/users/capstone-SuperTest/orgs",
                "repos_url": "https://api.github.com/users/capstone-SuperTest/repos",
                "events_url": "https://api.github.com/users/capstone-SuperTest/events{/privacy}",
                "received_events_url": "https://api.github.com/users/capstone-SuperTest/received_events",
                "type": "Organization",
                "user_view_type": "public",
                "site_admin": false
            },
            "html_url": "https://github.com/capstone-SuperTest/normal-private-repo",
            "description": null,
            "fork": false,
            "url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo",
            "forks_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/forks",
            "keys_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/keys{/key_id}",
            "collaborators_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/collaborators{/collaborator}",
            "teams_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/teams",
            "hooks_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/hooks",
            "issue_events_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/issues/events{/number}",
            "events_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/events",
            "assignees_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/assignees{/user}",
            "branches_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/branches{/branch}",
            "tags_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/tags",
            "blobs_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/git/blobs{/sha}",
            "git_tags_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/git/tags{/sha}",
            "git_refs_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/git/refs{/sha}",
            "trees_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/git/trees{/sha}",
            "statuses_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/statuses/{sha}",
            "languages_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/languages",
            "stargazers_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/stargazers",
            "contributors_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/contributors",
            "subscribers_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/subscribers",
            "subscription_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/subscription",
            "commits_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/commits{/sha}",
            "git_commits_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/git/commits{/sha}",
            "comments_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/comments{/number}",
            "issue_comment_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/issues/comments{/number}",
            "contents_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/contents/{+path}",
            "compare_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/compare/{base}...{head}",
            "merges_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/merges",
            "archive_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/{archive_format}{/ref}",
            "downloads_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/downloads",
            "issues_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/issues{/number}",
            "pulls_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/pulls{/number}",
            "milestones_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/milestones{/number}",
            "notifications_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/notifications{?since,all,participating}",
            "labels_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/labels{/name}",
            "releases_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/releases{/id}",
            "deployments_url": "https://api.github.com/repos/capstone-SuperTest/normal-private-repo/deployments",
            "created_at": "2025-09-30T18:04:58Z",
            "updated_at": "2025-09-30T18:04:58Z",
            "pushed_at": "2025-09-30T18:04:58Z",
            "git_url": "git://github.com/capstone-SuperTest/normal-private-repo.git",
            "ssh_url": "git@github.com:capstone-SuperTest/normal-private-repo.git",
            "clone_url": "https://github.com/capstone-SuperTest/normal-private-repo.git",
            "svn_url": "https://github.com/capstone-SuperTest/normal-private-repo",
            "homepage": null,
            "size": 0,
            "stargazers_count": 0,
            "watchers_count": 0,
            "language": null,
            "has_issues": true,
            "has_projects": true,
            "has_downloads": true,
            "has_wiki": false,
            "has_pages": false,
            "has_discussions": false,
            "forks_count": 0,
            "mirror_url": null,
            "archived": false,
            "disabled": false,
            "open_issues_count": 0,
            "license": null,
            "allow_forking": false,
            "is_template": false,
            "web_commit_signoff_required": false,
            "topics": [],
            "visibility": "private",
            "forks": 0,
            "open_issues": 0,
            "watchers": 0,
            "default_branch": "main",
            "permissions": {
                "admin": false,
                "maintain": false,
                "push": false,
                "triage": false,
                "pull": false
            }
        }
    ]
}
 * @throws Responds with a 500 status code and error details if an exception occurs.
 */
export async function getGithubRepos(req: Request, res: Response) {
    try {
        const token = await getInstallationAccessToken();
        
        const response = await axios.get("https://api.github.com/installation/repositories", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github+json",
            },
        });

        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch GitHub repositories");
    }
}

export async function addUserToRepo(req: Request, res: Response) {
    try {
        // Validation: check if body exists and has required fields
        if (!req.body) {
            return res
                .status(400)
                .json(buildError(400, 'Request body is required', null));
        }

        const { username, permission } = req.body;
        const repoId = parseInt(req.params.repoId);

        // Validation: required fields
        if (!username || !permission) {
            return res
                .status(400)
                .json(buildError(400, 'Missing required fields: username, permission', null));
        }

        // Validation: valid repoId
        if (isNaN(repoId)) {
            return res
                .status(400)
                .json(buildError(400, 'Invalid repository ID', null));
        }

        const result = await addUserToRepoService(repoId, username, permission);
        
        let finalResponse = buildResponse(
            200,
            'User added to repository successfully!',
            result
        );
        res.status(200).json(finalResponse);

    } catch (error: any) {
        console.error('ADD USER TO REPO ERROR:', error);
        let finalResponse = buildError(500, 'Failed to add user to repository', error);
        res.status(500).json(finalResponse);
    }
}

/**
 * Controller to create a repository collaborator request in the database 
 *    
 * @param req - Request object containing userId, repoId, permission, and githubUsername
 * @param res - Response Object
 *
 * @returns A JSON response with the HTTP 201 message 
 *
 * @throws Responds with a 500 status code and error details if an exception occurs.
 */
export async function createRepoCollaboratorRequest(req: Request, res: Response) {
    console.log('Request Body:', req.body);

    try {
        // Validation: check if body exists
        if (!req.body) {
            return res
                .status(400)
                .json(buildError(400, 'Request body is required', null));
        }

        const { userId, repoId, permission, githubUsername } = req.body;

        // Validation: required fields
        if (!userId || !repoId || !permission || !githubUsername) {
            return res
                .status(400)
                .json(buildError(400, 'Missing required fields: userId, repoId, permission, githubUsername', null));
        }

        const request = await githubService.createRepoCollaboratorRequest(userId, repoId, permission, githubUsername);

        let finalResponse = buildResponse(
            201,
            'Repository collaborator request created successfully!',
            request
        );

        res.status(201).json(finalResponse);

    } catch (error: any) {
        let finalResponse = buildError(500, 'There was an error creating the request', error);
        res.status(500).json(finalResponse);
    }
}

/**
 * Controller to read repository collaborator requests from the database
 *    
 * @param req - Request object with optional id parameter and query parameters
 * @param res - Response Object
 *
 * @returns A JSON response with the HTTP 200 message 
 *
 * @throws Responds with a 500 status code and error details if an exception occurs.
 */
export async function readRepoCollaboratorRequest(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { userId, repoId } = req.query;

        let requests;
        let message = '';

        if (id) {
            // Read a specific request by ID
            const requestId = parseInt(id);
            if (isNaN(requestId)) {
                return res
                    .status(400)
                    .json(buildError(400, 'Invalid request ID', null));
            }

            requests = await githubService.readRepoCollaboratorRequestById(requestId);
            if (!requests) {
                return res
                    .status(404)
                    .json(buildError(404, 'Repository collaborator request not found', null));
            }

            message = 'Repository collaborator request retrieved successfully.';
        } else if (userId) {
            // Read requests by user ID
            const userIdNum = parseInt(userId as string);
            if (isNaN(userIdNum)) {
                return res
                    .status(400)
                    .json(buildError(400, 'Invalid user ID', null));
            }

            requests = await githubService.readRepoCollaboratorRequestsByUserId(userIdNum);
            message = requests.length > 0 
                ? 'User repository collaborator requests retrieved successfully.' 
                : 'No requests found for this user.';
        } else if (repoId) {
            // Read requests by repo ID
            const repoIdNum = parseInt(repoId as string);
            if (isNaN(repoIdNum)) {
                return res
                    .status(400)
                    .json(buildError(400, 'Invalid repo ID', null));
            }

            requests = await githubService.readRepoCollaboratorRequestsByRepoId(repoIdNum);
            message = requests.length > 0 
                ? 'Repository collaborator requests retrieved successfully.' 
                : 'No requests found for this repository.';
        } else {
            // Read all requests
            requests = await githubService.readAllRepoCollaboratorRequests();
            message = requests.length > 0 
                ? 'Repository collaborator requests retrieved successfully.' 
                : 'No repository collaborator requests found.';
        }

        let finalResponse = buildResponse(200, message, requests);
        res.status(200).json(finalResponse);

    } catch (error: any) {
        let finalResponse = buildError(500, 'There was an error retrieving requests', error);
        res.status(500).json(finalResponse);
    }
}

/**
 * Controller to update a repository collaborator request in the database
 *    
 * @param req - Request object containing id parameter and update data in body
 * @param res - Response Object
 *
 * @returns A JSON response with the HTTP 200 message 
 *
 * @throws Responds with a 500 status code and error details if an exception occurs.
 */
export async function updateRepoCollaboratorRequest(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const data = req.body;

        if (!id) {
            return res
                .status(400)
                .json(buildError(400, 'Request ID is required', null));
        }

        const requestId = parseInt(id);
        if (isNaN(requestId)) {
            return res
                .status(400)
                .json(buildError(400, 'Invalid request ID', null));
        }

        if (!data || Object.keys(data).length === 0) {
            return res
                .status(400)
                .json(buildError(400, 'Request body cannot be empty', null));
        }

        const existingRequest = await githubService.readRepoCollaboratorRequestById(requestId);
        if (!existingRequest) {
            return res
                .status(404)
                .json(buildError(404, 'Repository collaborator request not found', null));
        }

        const updatedRequest = await githubService.updateRepoCollaboratorRequest(requestId, data);

        let finalResponse = buildResponse(
            200,
            'Repository collaborator request updated successfully!',
            updatedRequest
        );
        res.status(200).json(finalResponse);

    } catch (error: any) {
        let finalResponse = buildError(500, 'There was an error updating the request', error);
        res.status(500).json(finalResponse);
    }
}

/**
 * Controller to delete repository collaborator requests from the database
 *    
 * @param req - Request object containing id parameter or requestIdArray in body
 * @param res - Response Object
 *
 * @returns A JSON response with the HTTP 200 message 
 *
 * @throws Responds with a 500 status code and error details if an exception occurs.
 */
export async function deleteRepoCollaboratorRequest(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const requestIdArray = req.body?.requestIdArray;

        const deletedRequests = [];
        let message = '';

        if (id) {
            // Delete single request
            const requestId = parseInt(id);
            if (isNaN(requestId)) {
                return res
                    .status(400)
                    .json(buildError(400, 'Invalid request ID', null));
            }

            const deletedRequest = await githubService.deleteRepoCollaboratorRequest(requestId);
            deletedRequests.push(deletedRequest);
            message = 'Repository collaborator request deleted successfully.';
        } else if (requestIdArray && Array.isArray(requestIdArray) && requestIdArray.length > 0) {
            // Delete multiple requests
            for (const requestIdString of requestIdArray) {
                const requestId = parseInt(requestIdString);
                if (!isNaN(requestId)) {
                    const request = await githubService.deleteRepoCollaboratorRequest(requestId);
                    if (request) deletedRequests.push(request);
                }
            }

            if (deletedRequests.length === 0) {
                return res
                    .status(400)
                    .json(buildError(400, 'No requests were deleted. Check if request IDs are valid.', null));
            }

            message = `${deletedRequests.length} repository collaborator request(s) deleted successfully.`;
        } else {
            return res
                .status(400)
                .json(buildError(400, 'Provide request ID in URL or requestIdArray in body', null));
        }

        let finalResponse = buildResponse(200, message, deletedRequests);
        res.status(200).json(finalResponse);

    } catch (error: any) {
        let finalResponse = buildError(500, 'There was an error deleting request(s)', error);
        res.status(500).json(finalResponse);
    }
}