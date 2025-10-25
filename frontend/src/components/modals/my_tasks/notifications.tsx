import Button from '../../ui/button';
import { useState } from 'react';

type notificationModal = {
	handleModalDisplay: () => void;
	notificationId: number;
};

export default function NotificationModal({
	handleModalDisplay,
	notificationId,
}: notificationModal) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

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

	function handleModalClose() {
		setName('');
		setDescription('');

		handleModalDisplay();
	}

	return (
		<div className="flex flex-col gap-1 px-2">
			{/* TITLE */}
			<div className="">
				<p className="text-2xl">Notification Title</p>
			</div>
			{/* Subtitle */}
			<div className="mb-2">
				<p className="mb-2 text-xl">Message from: PERSON</p>
				<p className="mb-2">
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Omnis, quidem exercitationem nulla aliquid quas est
					perferendis mollitia, nostrum nisi vero delectus eos
					temporibus alias consequatur deserunt impedit tempore libero
					tempora!
				</p>
			</div>
			{/* Information */}
			<div className="">
				<div className="flex">
					<div className="min-w-32">Sent: </div>
					<div>{new Date().toDateString()}</div>
				</div>
				<div className="flex">
					<div className="min-w-32">Read: </div>
					<div>{new Date().toDateString()}</div>
				</div>
				<div className="flex">
					<div className="min-w-32">Sent by: </div>
					<div>PERSON</div>
				</div>
			</div>
			{/* BUTTONS */}
			<div className="flex">
				<Button
					type="Info"
					text="Back"
					onClick={() => handleModalClose()}
				/>
			</div>
		</div>
	);
}
