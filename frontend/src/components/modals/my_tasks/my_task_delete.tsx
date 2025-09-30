import Button from '../../ui/button';

/**
 * SERVICES/HELPERS
 */
import { readTask } from '../../../lib/services/api/task';
import { createDeletionRequest } from '../../../lib/services/api/deletion_request';
import { formatDate } from '../../../lib/helpers/datehelpers';

/**
 * HOOKS
 */
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../lib/contexts/AuthContext';

/**
 * TYPES
 */
import { type Task } from '../../../lib/types/models';

type myTaskDeleteModal = {
	handleModalDisplay: () => void;
	taskId: number;
};

export default function MyTaskDeleteModal({
	handleModalDisplay,
	taskId,
}: myTaskDeleteModal) {
	const { token } = useAuthContext();
	const [reason, setReason] = useState<string>('');
	const [deletionRequestSuccess, setDeletionRequestSuccess] =
		useState<boolean>(false);

	const [task, setTask] = useState<Task | null>();

	/**
	 * INTERNAL FUNCTIONS
	 */

	useEffect(() => {
		async function start() {
			await fetchTaskInfo(taskId);
		}
		start();
	}, []);

	async function fetchTaskInfo(taskId: number) {
		const taskRow = await readTask(token!, taskId);
		setTask(taskRow[0]);
	}

	/**
	 * Handlers
	 */

	async function handleSubmitClick() {
		// TODO: Add proper displaying in case there's an error
		try {
			// Reason cannot be blank
			if (reason.trim().length > 0) {
				await createDeletionRequest(token!, taskId, reason);
				setDeletionRequestSuccess(true);
			} else {
				alert('CANNOT BE EMPTY');
			}
		} catch (error) {
			console.log(error);
		}
	}

	function handleModalClose() {
		handleModalDisplay();
	}

	/**
	 * HTML Returner
	 * Placed here to make things cleaner.
	 */

	function htmlSuccessfulDelReq() {
		return (
			<>
				{/* TITLE */}
				<div className="p-2">
					<p className="text-2xl">Deletion Request</p>
				</div>
				{/* Reason */}
				<div className="mb-2 p-2">
					<p className="mb-2 text-xl">Sent</p>
					<p className="mb-2">
						Your request for task deletion has been noted and sent.
					</p>
				</div>

				{/* BUTTONS */}
				<div className="flex">
					<Button
						buttonType="add"
						buttonText="Continue"
						buttonOnClick={() => handleModalClose()}
					/>
				</div>
			</>
		);
	}

	function htmlExistingDelReq() {
		return (
			<>
				{/* TITLE */}
				<div className="p-2">
					<p className="text-2xl">Deletion Request</p>
				</div>

				{/* Information */}
				<div className="mb-2 p-2">
					<p className="mb-2 text-xl">Request already exists!</p>
					<p className="mb-2">
						An existing deletion request has been made for this task
						already.
					</p>
				</div>

				<div className="">
					<div className="flex">
						<div className="min-w-32">Requested By: </div>
						<div>{task?.deletionRequest![0].user?.email}</div>
					</div>
					<div className="flex">
						<div className="min-w-32">Requested On: </div>
						<div>
							{formatDate(
								new Date(task?.deletionRequest![0].createdAt!)
							)}
						</div>
					</div>
				</div>

				{/* BUTTONS */}
				<div className="flex">
					<Button
						buttonType="add"
						buttonText="Continue"
						buttonOnClick={() => handleModalClose()}
					/>
				</div>
			</>
		);
	}

	function htmlDefaultDisplay() {
		return (
			<>
				{/* TITLE */}
				<div className="p-2">
					<p className="text-2xl">Deletion Request</p>
				</div>

				{/* Information */}
				<div className="">
					<div className="flex">
						<div className="min-w-32">Task Name: </div>
						<div>{task?.name}</div>
					</div>
					<div className="flex">
						<div className="min-w-32">Task Descrption: </div>
						<div>{task?.description}</div>
					</div>
					<div className="flex">
						<div className="min-w-32">Created At: </div>
						<div>{formatDate(new Date(task?.createdAt!))}</div>
					</div>
					<div className="flex">
						<div className="min-w-32">Created By: </div>
						<div>{task?.createdByUser?.username}</div>
					</div>
				</div>
				{/* Reason */}
				<div className="mb-2 p-2">
					<textarea
						className="w-full"
						name=""
						id=""
						rows={5}
						onChange={(e) => setReason(e.target.value)}
						placeholder="Enter reason for deletion..."
					></textarea>
				</div>

				{/* BUTTONS */}
				<div className="flex justify-evenly">
					<Button
						buttonType="add"
						buttonText="Submit"
						buttonOnClick={() => handleSubmitClick()}
					/>
					<Button
						buttonType="add"
						buttonText="Back"
						buttonOnClick={() => handleModalClose()}
					/>
				</div>
			</>
		);
	}

	let html: any = htmlDefaultDisplay();
	// If a task exist and it has a deletion request
	if (task && task.deletionRequest && task.deletionRequest.length > 0) {
		html = htmlExistingDelReq();
	}

	// If request was successful
	if (deletionRequestSuccess) {
		html = htmlSuccessfulDelReq();
	}

	// Display default page
	return (
		<div className="flex flex-col gap-2 mx-5 pb-2 overflow-y-auto h-screen">
			{html}
		</div>
	);
}
