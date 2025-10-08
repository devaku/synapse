import { Request, Response } from 'express';
import * as imageService from '../services/images-service';
import * as commentService from '../services/comments-service';
import * as imageLinkService from '../services/image-link-service';
import { buildResponse, buildError } from '../lib/response-helper';

export async function createComment(req: Request, res: Response) {
	try {
		// req.files[0].filename
		console.log(req.files);

		let { message, taskId } = req.body;
		taskId = Number(taskId);

		const userId = req.session.userData?.user.id;
		const IMAGE_STORAGE_URL = `${process.env.SERVER_URL}:${process.env.PORT}/public/uploads`;

		// Create the comment in the database
		const commentRow = await commentService.createComment(
			userId!,
			taskId,
			message
		);

		// If there were images uploaded
		// store them to database
		let imageRows;
		if (Array.isArray(req.files)) {
			const uploaded = req.files;
			if (uploaded.length > 0) {
				const images = uploaded.map((el: any) => {
					return `${IMAGE_STORAGE_URL}/${el.filename}`;
				});
				imageRows = await imageService.createImage(userId!, images);
			}
		}

		// Link the images to the comment created
		if (imageRows) {
			let imageIds = imageRows.map((el) => el.id);
			await imageLinkService.linkImagesToComments(
				imageIds,
				commentRow.id
			);
		}

		// Retrieve comment, this time with all the comments
		const commentList = await commentService.readComment(taskId);
		let finalMessage = '';
		finalMessage =
			commentList.length > 0
				? 'Data retrieved successfully.'
				: 'No data found.';

		return res
			.status(200)
			.json(buildResponse(200, finalMessage, commentList));
	} catch (error: any) {
		console.error('Error:', error);
		return res
			.status(500)
			.json(buildError(500, 'Error retrieving tasks', error));
	}
}
