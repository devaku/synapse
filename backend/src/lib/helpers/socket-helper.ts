import { Server as SocketIOServer } from 'socket.io';
import * as SocketEvents from '../socket-events';

export function pingUsersBasedOnVisiblity(
	io: SocketIOServer,
	taskVisibleToTeams?: number[],
	taskVisibleToUsers?: number[]
) {
	if (taskVisibleToTeams && taskVisibleToTeams.length > 0) {
		taskVisibleToTeams.map((el) => {
			io.to(`TEAM-${Number(el)}`).emit(
				SocketEvents.TASK.COMMENTS_SECTION
			);
		});
	}

	if (taskVisibleToUsers && taskVisibleToUsers.length > 0) {
		taskVisibleToUsers.map((el) => {
			io.to(`USER-${Number(el)}`).emit(
				SocketEvents.TASK.COMMENTS_SECTION
			);
		});
	}
}

export function pingUsersOfNewCommentOnTask(
	io: SocketIOServer,
	usersSubscribedToTask: number[],
	payload: any
) {
	if (usersSubscribedToTask && usersSubscribedToTask.length > 0) {
		// Refresh the comments section
		usersSubscribedToTask.map((el) => {
			io.to(`USER-${Number(el)}`).emit(
				SocketEvents.TASK.COMMENTS_SECTION
			);
		});

		// Trigger the bell
		usersSubscribedToTask.map((el) => {
			io.to(`USER-${Number(el)}`).emit(
				SocketEvents.NOTIFICATION.NOTIFICATION,
				payload
			);
		});
	}
}
