import express from "express";
import { Request, Response } from 'express';
import { createGithubAppJwt, getInstallationAccessToken } from "../lib/github-app-auth";
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

