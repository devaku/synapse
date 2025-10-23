/**
 * COMPONENTS
 */

import Button from '../../ui/button';
import CommentComponent from '../task/comment_component';

/**
 * HOOKS
 */

import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../lib/contexts/AuthContext';
import { useSocketContext } from '../../../lib/contexts/SocketContext';

/**
 * SERVICES / HELPERS
 */

import {
	archiveTask,
	readTask,
	subscribeToTask,
	unsubscribeToTask,
} from '../../../lib/services/api/task';
import { type Comment, type Task } from '../../../lib/types/models';
import * as socketEvents from '../../../lib/helpers/socket-events';

type myTaskReadModalProps = {
	handleModalDisplay: () => void;
	taskId: number;
};

export default function MyTaskReadModal({
	handleModalDisplay,
	taskId,
}: myTaskReadModalProps) {
	const { token, userData } = useAuthContext();
	const { socket } = useSocketContext();
	const [comments, setComments] = useState<Comment[] | null>(null);
	const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
	const [isArchived, setIsArchived] = useState<boolean>(false);

	/**
	 * INTERNAL FUNCTIONS
	 */

	useEffect(() => {
		async function start() {
			await fetchTaskInfo(taskId);
		}
		start();
	}, [taskId]);

	// SOCKET SUBSCRIPTION

	useEffect(() => {
		async function start() {
			await fetchTaskInfo(taskId);
		}

		async function archiver() {
			setIsArchived(true);
		}
		start();

		socket?.on(socketEvents.TASK.COMMENTS_SECTION, start);
		socket?.on(socketEvents.TASK.TASK_ARCHIVED, archiver);
		return () => {
			socket?.off(socketEvents.TASK.COMMENTS_SECTION, start);
			socket?.off(socketEvents.TASK.TASK_ARCHIVED, archiver);
		};
	}, [socket]);

	async function fetchTaskInfo(taskId: number) {
		const taskRow = await readTask(token!, taskId);
		let currentTask: Task = taskRow[0];

		// Load the comments
		if (currentTask.comments) {
			setComments(currentTask.comments);
		}

		// Determine if user viewing the page
		// is currently subscribed
		let ids = currentTask.taskUserSubscribeTo?.map((el) => {
			return el.user?.keycloakId;
		});

		if (ids?.includes(userData.sub!)) {
			setIsSubscribed(true);
		} else {
			setIsSubscribed(false);
		}
	}

	/**
	 * Handlers
	 */

	async function handleSubscribeClick() {
		// TODO: Add proper displaying in case there's an error
		try {
			await subscribeToTask(token!, taskId);
			setIsSubscribed(true);

			// Close modal
		} catch (error) {
			console.log(error);
		}
	}

	async function handleUnsubscribeClick() {
		// TODO: Add proper displaying in case there's an error
		try {
			await unsubscribeToTask(token!, taskId);
			setIsSubscribed(false);

			// Close modal
		} catch (error) {
			console.log(error);
		}
	}

	async function handleButtonCompleteClick() {
		// TODO: Add proper displaying in case there's an error
		try {
			await archiveTask(token!, taskId);

			// Close modal
			handleModalDisplay();
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="">
			{isArchived ? (
				<div>
					<h2>This task has been archived.</h2>
					<div className="flex justify-evenly">
						<Button
							type="Info"
							text="Back"
							onClick={() => handleModalDisplay()}
						/>
					</div>
				</div>
			) : (
				<div>
					{/* BUTTONS */}
					<div className="flex justify-evenly">
						{isSubscribed ? (
							<>
								<Button
									type="Success"
									text="Complete"
									onClick={() => handleButtonCompleteClick()}
								/>
								<Button
									type="Danger"
									text="Unsubscribe"
									onClick={() => {
										handleUnsubscribeClick();
									}}
								/>
							</>
						) : (
							<Button
								type="Success"
								text="Subscribe"
								onClick={() => {
									handleSubscribeClick();
								}}
							/>
						)}

						<Button
							type="Info"
							text="Back"
							onClick={() => handleModalDisplay()}
						/>
					</div>
					{/* COMMENTS SECTION*/}
					<div>
						<CommentComponent
							taskId={taskId}
							comments={comments}
							isSubscribed={isSubscribed}
						></CommentComponent>
					</div>
				</div>
			)}
		</div>
	);
}
