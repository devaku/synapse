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

import { archiveTask, readTask } from '../../../lib/services/api/task';
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
		start();

		socket?.on(socketEvents.TASK.COMMENTS_SECTION, start);
		return () => {
			socket?.off(socketEvents.TASK.COMMENTS_SECTION, start);
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
			{/* BUTTONS */}
			<div className="flex justify-evenly">
				{isSubscribed ? (
					<>
						<Button
							buttonType="add"
							buttonText="Complete"
							buttonOnClick={() => handleButtonCompleteClick()}
						/>
						<Button
							buttonType="add"
							buttonText="Unsubscribe"
							buttonOnClick={() => {
								console.log('Unsub');
							}}
						/>
					</>
				) : (
					<Button
						buttonType="add"
						buttonText="Subscribe"
						buttonOnClick={() => {
							console.log('Sub');
						}}
					/>
				)}

				<Button
					buttonType="add"
					buttonText="Back"
					buttonOnClick={() => handleModalDisplay()}
				/>
			</div>
			{/* COMMENTS SECTION*/}
			<div>
				<CommentComponent
					taskId={taskId}
					comments={comments}
					isSubscribed={isSubscribed}
				>
					{/* <div className="mt-2">
						<Button
							buttonType="add"
							buttonText="Comment"
							buttonOnClick={() => handleModalClose()}
						/>
					</div> */}
				</CommentComponent>
			</div>
		</div>
	);
}
