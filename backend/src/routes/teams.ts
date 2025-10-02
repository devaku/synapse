import express from 'express';
import { createTeam, readTeam } from '../controllers/teams-controller';

const teamRouter = express.Router();

teamRouter.get('/teams', readTeam);
teamRouter.post('/teams', express.json(), createTeam);

export default teamRouter;
