import { Request, Response } from 'express';
import * as delreqService from '../services/deletion-request-service';
import { buildResponse, buildError } from '../lib/response-helper';

export async function createDeletionRequest(req: Request, res: Response) {
	try {
		let userId = req.session.userData?.user.id;
		let data = req.body;

		// Attach userId
		data.requestedBy = userId;
		const rowData = await delreqService.createDeletionRequest(data);

		// TODO: Inform the owner??? of the task that a deletion request has been made

		let finalResponse = buildResponse(
			200,
			'Data was created successfully!',
			rowData
		);

		res.status(201).json(finalResponse);
	} catch (error: any) {
		let finalResponse = buildError(500, 'There was an error', error);
		res.status(500).json(finalResponse);
	}
}
