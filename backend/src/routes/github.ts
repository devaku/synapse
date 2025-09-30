import express from 'express';
import {
    getGithubRepos,
} from '../controllers/github-controllers';

const githubRouter = express.Router();

githubRouter.get('/github-repos', getGithubRepos);

export default githubRouter; 