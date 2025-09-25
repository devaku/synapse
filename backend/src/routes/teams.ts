import express from 'express';
import {
	createTeam,
	readTeam,
	deleteTeam,
	softDeleteTeam
} from '../controllers/teams-controller';

const teamRouter = express.Router();

teamRouter.get('/teams',readTeam);
teamRouter.post('/teams', express.json() ,createTeam);
teamRouter.delete('/teams/', express.json(), deleteTeam);
teamRouter.patch('/teams/soft-delete/', express.json(), softDeleteTeam);

export default teamRouter; 