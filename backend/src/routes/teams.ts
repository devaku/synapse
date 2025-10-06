import express from 'express';
import {
	createTeam,
	readTeam,
	deleteTeam,
	softDeleteTeam,
	updateTeam,
} from '../controllers/teams-controller';

const teamRouter = express.Router();

// endpoint to read team
teamRouter.get('/teams', readTeam);
// endpoint to create team
teamRouter.post('/teams', express.json(), createTeam);
// endpoint to delete multiple team
teamRouter.delete('/teams/', express.json(), deleteTeam);
// endpoint to soft delete multiple teams
teamRouter.patch('/teams/soft-delete/', express.json(), softDeleteTeam);
// endpoint to fully update a team
teamRouter.put('/teams/', express.json(), updateTeam);

export default teamRouter;
