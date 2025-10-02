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

import { archiveTask } from '../../../lib/services/api/task';

type myTaskReadModalProps = {
	handleModalDisplay: () => void;
	taskId: number;
};

export default function MyTaskReadModal({
	handleModalDisplay,
	taskId,
}: myTaskReadModalProps) {
	const { token } = useAuthContext();

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
				<Button
					buttonType="add"
					buttonText="Complete"
					buttonOnClick={() => handleButtonCompleteClick()}
				/>
				<Button
					buttonType="add"
					buttonText="Back"
					buttonOnClick={() => handleModalDisplay()}
				/>
			</div>
			{/* COMMENTS SECTION*/}
			<div>
				<p className="mb-2">Comments:</p>

				{/* INPUT */}
				<div className="p-2 mb-2 rounded-lg shadow-md">
					{/* Profile */}
					<div className="flex items-center gap-2">
						<div className="w-10 h-10">
							<img src={TTGLogo} alt="" srcSet="" />
						</div>
						<p>John Doe</p>
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
				{/* COMMENTS */}
				<div>
					<CommentCard
						key={1}
						profile_picture_url={''}
						comment={'lorem ipsum na may dimsum'}
						name={'Jane Doe'}
						timestamp={new Date().toString()}
					></CommentCard>
					<CommentCard
						key={2}
						profile_picture_url={''}
						comment={'This is the second comment'}
						name={'Alex King'}
						timestamp={new Date().toString()}
					></CommentCard>
					<CommentCard
						key={3}
						profile_picture_url={''}
						comment={'THIRD'}
						name={'First Last'}
						timestamp={new Date().toString()}
					></CommentCard>
				</div>
			</div>
		</div>
	);
}
