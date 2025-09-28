import { Request, Response } from 'express';
import * as teamsService from '../services/teams-service';
import { buildResponse, buildError } from '../lib/response-helper';

export async function createTeam (req : Request, res : Response){

    try {

        let data = req.body 
        const team = await teamsService.createTeam(data)
        
        let finalResponse = buildResponse(
			201,
			'Data was created successfully!',
			team
		);

        res.status(201).json(finalResponse);



    }catch (error: any) {
		let finalResponse = buildError(500, 'There was an error', error);
		res.status(500).json(finalResponse);
	}

}

export async function readTeam (req : Request, res : Response) {

    try{

        let data = req.body; 
        const team = await teamsService.readAllTeam();
        let message = ''; 

        if (team.length > 0){
            message = 'Data was retrieved successfully.';
        }
        else{
            message = 'Table is empty';
        }

        let finalResponse = buildResponse(200,message,team)
 		res.status(200).json(finalResponse);
        
	} catch (error) {
		let finalResponse = buildError(500, 'There was an error', error);
		res.status(500).json(finalResponse);
	}


}