import TTGLogo from '../../../assets/images/ttglogo/TTG_Profile.png';

/**
 * COMPONENTS
 */

import Button from '../../ui/button';
import CommentCard from '../../container/comment_card';

/**
 * HOOKS
 */

import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../lib/contexts/AuthContext';

/**
 * SERVICES / HELPERS
 */

import { archiveTask, readTask } from '../../../lib/services/api/task';
import { type Comment, type Task } from '../../../lib/types/models';

type myTaskReadModalProps = {
	handleModalDisplay: () => void;
	taskId: number;
};

export default function MyTaskReadModal({
	handleModalDisplay,
	taskId,
}: myTaskReadModalProps) {
	const { token, userData } = useAuthContext();
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

		if (ids?.includes(userData.sub)) {
			setIsSubscribed(true);
		} else {
			setIsSubscribed(false);
		}
	}

	function loadComments() {
		return comments?.map((el, index) => {
			return (
				<CommentCard
					key={index}
					profile_picture_url={''}
					comment={el.message}
					name={el.user?.email!}
					timestamp={new Date().toString()}
				></CommentCard>
			);
		});
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

	/**
	 * MODAL HANDLERS
	 */

	function handleModalClose() {}

	function handleModalTaskDeleteDisplay() {
		handleModalDisplay();
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
				<p className="my-2">
					{comments && comments.length > 0
						? 'Comments:'
						: 'There are currently no comments.'}
				</p>

				{/* INPUT */}
				{/* Input is only displayed if they are subscribed */}
				{isSubscribed ? (
					<div className="p-2 mb-2 rounded-lg shadow-md">
						{/* Profile */}
						<div className="flex items-center gap-2">
							<div className="w-10 h-10">
								<img src={TTGLogo} alt="" srcSet="" />
							</div>
							<p>{userData.email}</p>
						</div>
						<textarea
							className="w-full"
							name=""
							id=""
							rows={5}
							placeholder="Enter a comment..."
						></textarea>
						<div className="mt-2">
							<Button
								buttonType="add"
								buttonText="Comment"
								buttonOnClick={() => handleModalClose()}
							/>
						</div>
					</div>
				) : (
					''
				)}

				{/* COMMENTS */}
				<div>{loadComments()}</div>
			</div>
		</div>
	);
}
