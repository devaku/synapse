import express from 'express';
import {
    getGithubJwt,
} from '../controllers/github-controllers';

const githubRouter = express.Router();

githubRouter.get('/github-jwt',getGithubJwt);

export default githubRouter; 