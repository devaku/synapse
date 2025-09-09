import Button from '../../ui/button';
import { useState } from 'react';

type myTaskDeleteModal = {
	handleModalDisplay: () => void;
	taskId: number;
};

export default function MyTaskDeleteModal({
	handleModalDisplay,
	taskId,
}: myTaskDeleteModal) {
	const [deletionRequestSuccess, setDeletionRequestSuccess] =
		useState<boolean>(false);

	/**
	 * Handlers
	 */

	async function handleSubmitClick() {
		// TODO: Add proper displaying in case there's an error
		try {
			setDeletionRequestSuccess(true);
		} catch (error) {}
	}

	function handleModalClose() {
		handleModalDisplay();
	}

	if (deletionRequestSuccess) {
		return (
			<div>
				<div>DELETION REQUEST SENT SUCCESSFULLY</div>
				<div className="">
					<Button
						buttonType="add"
						buttonText="Submit"
						buttonOnClick={() => handleModalClose()}
					/>
				</div>
			</div>
		);
	} else {
		return (
			<div className="flex flex-col gap-2 mx-5 pb-2 overflow-y-auto h-screen">
				{/* TITLE */}
				<div className="p-2">
					<p className="text-5xl">Deletion Request</p>
				</div>
				{/* Reason */}
				<div className="mb-2 p-2">
					<p className="mb-2">Enter your reason for deleting:</p>
					<p className="mb-2">Task 1</p>
					<textarea
						className="w-full"
						name=""
						id=""
						rows={5}
						placeholder="Enter a comment..."
					></textarea>
				</div>
				<div className="">
					<Button
						buttonType="add"
						buttonText="Submit"
						buttonOnClick={() => handleSubmitClick()}
					/>
				</div>

				{/* Information */}
				<div className="">
					<div className="flex">
						<div className="min-w-32">Created: </div>
						<div>{new Date().toDateString()}</div>
					</div>
					<div className="flex">
						<div className="min-w-32">Taken: </div>
						<div>{new Date().toDateString()}</div>
					</div>
					<div className="flex">
						<div className="min-w-32">Due: </div>
						<div>{new Date().toDateString()}</div>
					</div>
					<div className="flex">
						<div className="min-w-32">Submitted: </div>
						<div>N/A</div>
					</div>
					<div className="flex">
						<div className="min-w-32">Team: </div>
						<div>The Best Team</div>
					</div>
					<div className="flex">
						<div className="min-w-32">Assigned By: </div>
						<div>Manager</div>
					</div>
					<div className="flex">
						<div className="min-w-32">Taken By: </div>
						<div>Employee</div>
					</div>
				</div>
				{/* BUTTONS */}
				<div className="flex">
					<Button
						buttonType="add"
						buttonText="Back"
						buttonOnClick={() => handleModalClose()}
					/>
				</div>
			</div>
		);
	}
}
