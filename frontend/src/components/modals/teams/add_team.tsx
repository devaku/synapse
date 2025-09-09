import Button from '../../ui/button';

import { useState } from 'react';
import { CreateTeam } from '../../../lib/services/team_service';

type addTeamModalProps = {
	handleModalDisplay: () => void;
};

export default function AddTeamModal({
	handleModalDisplay,
}: addTeamModalProps) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	/**
	 * Handlers
	 */

	async function handleAddTeamClick() {
		// TODO: Add proper displaying in case there's an error
		try {
			await CreateTeam(name, description);
			handleModalClose();
		} catch (error) {
			console.log(error);
		}
	}

	function handleDescriptionChange(
		e: React.ChangeEvent<HTMLTextAreaElement>
	) {
		setDescription(e.target.value);
	}

	function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		setName(e.target.value);
	}

	function handleModalClose() {
		setName('');
		setDescription('');

		handleModalDisplay();
	}

	return (
		<div className="flex flex-col gap-5 mx-5">
			<div className="mt-5 p-2">
				<p className="text-5xl ">Add Team</p>
			</div>

			<div>
				<p className="mb-2">Team Name:</p>
				<input
					onChange={handleNameChange}
					className="border-2 border-gray-300 p-1"
					type="text"
					name="team_name"
					id=""
					placeholder="Enter Team Name"
				/>
			</div>
			<div>
				<p className="mb-2">Description:</p>
				<textarea
					onChange={handleDescriptionChange}
					className="border-2 border-gray-300 w-full p-1 resize-none"
					name=""
					id=""
					rows={4}
					placeholder="Enter team description..."
				></textarea>
			</div>
			<div className="flex justify-evenly">
				<Button
					buttonType="add"
					buttonText="Add Team"
					buttonOnClick={() => handleAddTeamClick()}
				/>
				<Button
					buttonType="add"
					buttonText="Close Modal"
					buttonOnClick={() => handleModalClose()}
				/>
			</div>
		</div>
	);
}
