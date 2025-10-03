import express from 'express';
import {
    addUserToRepo,
    getGithubRepos,
    createRepoCollaboratorRequest,
    readRepoCollaboratorRequest,
    updateRepoCollaboratorRequest,
    deleteRepoCollaboratorRequest,
} from '../controllers/github-controllers';

const githubRouter = express.Router();

githubRouter.use(express.json());

githubRouter.get('/github-repos', getGithubRepos);
githubRouter.post('/github-repos/:repoId/collaborators', addUserToRepo);

// Repository Collaborator Request CRUD routes
githubRouter.post('/repo-requests',createRepoCollaboratorRequest);
githubRouter.get('/repo-requests', readRepoCollaboratorRequest);
githubRouter.get('/repo-requests/:id', express.json(),  readRepoCollaboratorRequest);
githubRouter.put('/repo-requests/:id', express.json(), updateRepoCollaboratorRequest);
githubRouter.delete('/repo-requests/:id', deleteRepoCollaboratorRequest);
githubRouter.delete('/repo-requests', express.json(), deleteRepoCollaboratorRequest);

export default githubRouter; 