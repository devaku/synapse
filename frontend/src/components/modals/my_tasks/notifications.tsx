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
		<div className="flex flex-col">
			<Button
				buttonType="add"
				buttonText="Close Modal"
				buttonOnClick={() => handleModalClose()}
			/>
			NOTIFICATION ID: {notificationId}
			THIS IS THE NOTIFICATION MODAL
		</div>
	);
}
