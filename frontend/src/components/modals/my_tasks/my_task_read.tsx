import TTGLogo from '../../../assets/images/ttglogo/TTG_Profile.png';

import Button from '../../ui/button';
import { useState } from 'react';
import StatusPill from '../../ui/status_pill';
import CommentCard from '../../container/comment_card';

type myTaskReadModalProps = {
	handleModalDisplay: () => void;
	taskId: number;
};

export default function MyTaskReadModal({
	handleModalDisplay,
	taskId,
}: myTaskReadModalProps) {
	const [showModalTaskDelete, setShowModalTaskDelete] = useState(false);

	/**
	 * Handlers
	 */

	async function handleAddTeamClick() {
		// TODO: Add proper displaying in case there's an error
		try {
			handleModalClose();
		} catch (error) {
			console.log(error);
		}
	}

	function handleButtonDeleteClick() {
		setShowModalTaskDelete(true);
	}

	/**
	 * MODAL HANDLERS
	 */

	function handleModalClose() {
		handleModalDisplay();
	}

	function handleModalTaskDeleteDisplay() {
		setShowModalTaskDelete(false);
	}

	function handleModalCloseAll() {
		handleModalTaskDeleteDisplay();
		handleModalClose();
	}

	return (
		<div className="flex flex-col gap-2 mx-5 pb-2 overflow-y-auto h-screen">
			{/* TITLE */}
			<div className="p-2">
				<p className="text-2xl">Task 1</p>
				<div className="mt-3">
					<StatusPill text={'PENDING'}></StatusPill>
				</div>
			</div>
			{/* DESCRIPTION */}
			<div>
				<p className="mb-2">Description:</p>
				<p>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit.
					Accusamus possimus nobis nulla placeat temporibus velit,
					ipsam ducimus cumque illo iusto nihil, repudiandae
					aspernatur inventore a totam facere sunt vero voluptatibus.
				</p>
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
			<div className="flex justify-evenly">
				<Button
					buttonType="add"
					buttonText="Complete"
					buttonOnClick={() => handleModalClose()}
				/>
				<Button
					buttonType="add"
					buttonText="Back"
					buttonOnClick={() => handleModalClose()}
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
