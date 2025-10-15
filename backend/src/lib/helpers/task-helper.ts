import { createImageService } from '../../services/images-service';
import { createImageLinkService } from '../../services/image-link-service';
import { IMAGE_STORAGE_URL } from '../env-variables';

import { createTaskService } from '../../services/task-service';
import { deleteUploadedFiles } from '../file-helper';

import { PrismaClientOrTransaction } from '../../types';
import { Server as SocketIOServer } from 'socket.io';

export async function uploadImages(
	tx: PrismaClientOrTransaction,
	files: Express.Multer.File[] | undefined,
	userId: number,
	taskId: number
) {
	const imageLinkService = createImageLinkService(tx);
	const imageService = createImageService(tx);
	// Save the images
	let imageRows;
	if (files) {
		const uploaded = files;
		if (uploaded.length > 0) {
			const images = uploaded.map((el: any) => {
				return `${IMAGE_STORAGE_URL}/${el.filename}`;
			});
			imageRows = await imageService.createImage(userId!, images);
		}
	}

	// Link the images to the task created
	if (imageRows) {
		let imageIds = imageRows.map((el: any) => el.id);
		await imageLinkService.linkImagesToTasks(imageIds, taskId);
	}
}

export async function removeImages(
	tx: PrismaClientOrTransaction,
	removedIds: number[],
	taskId: number
) {
	try {
		const imageLinkService = createImageLinkService(tx);
		const imageService = createImageService(tx);
		const taskService = createTaskService(tx);

		// Get all the images associated with the task
		const task = await taskService.readTaskById(taskId);

		if (task && task?.imagesAttachedToTasks.length > 0) {
			const removedUrls = task.imagesAttachedToTasks
				.filter((el) => removedIds.includes(el.imageId))
				.map((el) => el.image.imageUrl);

			if (removedUrls.length > 0) {
				// Remove the links in the table
				await imageLinkService.unlinkImagesToTasks(removedIds, taskId);

				// Delete the PHYSICAL images themselves that are in storage
				const fileObjects = removedUrls.map((el) => {
					const splits = el.split('/uploads/');
					const filename = splits[1];
					return {
						filename,
					};
				});

				const uploadFolder = `${globalThis.ROOT_DIR}/public/uploads`;
				await deleteUploadedFiles(fileObjects, uploadFolder);

				// Delete the entry in the image table
				await imageService.deleteImages(removedIds);
			}
		}
	} catch (error) {
		throw error;
	}
}

export function pingUsersBasedOnVisiblity(
	io: SocketIOServer,
	taskVisibleToTeams?: number[],
	taskVisibleToUsers?: number[]
) {
	if (taskVisibleToTeams && taskVisibleToTeams.length > 0) {
		console.log('UPDATING TEAMS');
		console.log(taskVisibleToTeams);
		taskVisibleToTeams.map((el) => {
			io.to(`TEAM-${Number(el)}`).emit('TASK:REFRESH');
		});
	}

	if (taskVisibleToUsers && taskVisibleToUsers.length > 0) {
		console.log('UPDATING USERS');
		taskVisibleToUsers.map((el) => {
			io.to(`USER-${Number(el)}`).emit('TASK:REFRESH');
		});
	}
}
