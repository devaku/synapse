import { useState } from 'react';
import DynamicModal from './dynamic_modal';
import schema from '../../../assets/schemas/schema.json';
import type { FieldMetadata } from './dynamic_modal';

const DynamicModalExample = () => {
	const [selectedForm, setSelectedForm] = useState<string>('userProfile');
	const [formState, setFormState] = useState<Record<string, any>>({});

	// Get the metadata for the selected form
	const getMetadata = (): FieldMetadata[] => {
		return (schema[selectedForm as keyof typeof schema] ||
			[]) as FieldMetadata[];
	};

	// Handle form state updates from the dynamic modal
	const handleFormStateChange = (newState: Record<string, any>) => {
		setFormState(newState);
	};

	// Reset form state when changing form types
	const handleFormTypeChange = (newFormType: string) => {
		setSelectedForm(newFormType);
		setFormState({}); // Clear the state display
	};

	return (
		<div>
			<h2>Dynamic Modal Testing</h2>

			{/* Form selector */}
			<div>
				<label htmlFor="formSelect">Select Form Type: </label>
				<select
					id="formSelect"
					value={selectedForm}
					onChange={(e) => handleFormTypeChange(e.target.value)}
					style={{ marginLeft: '10px', padding: '5px' }}
				>
					<option value="userProfile">User Profile</option>
					<option value="taskForm">Task Form</option>
					<option value="teamSettings">Team Settings</option>
				</select>
			</div>

			{/* Dynamic Modal */}
			<div>
				<h3>Dynamic Form: {selectedForm}</h3>
				<DynamicModal
					metadata={getMetadata()}
					onStateChange={handleFormStateChange}
				/>
			</div>

			{/* Real-time State Display */}
			<div>
				<h4>📊 Current Form State </h4>
				<div>
					{Object.keys(formState).length > 0 ? (
						<pre>{JSON.stringify(formState, null, 2)}</pre>
					) : (
						<em>Type to change state</em>
					)}
				</div>

				{/* Individual field display */}
				{Object.keys(formState).length > 0 && (
					<div style={{ marginTop: '10px' }}>
						<ul style={{ margin: '0', paddingLeft: '20px' }}>
							{Object.entries(formState).map(([key, value]) => (
								<li key={key}>
									<strong>{key}:</strong>{' '}
									{typeof value === 'boolean'
										? String(value)
										: Array.isArray(value)
											? `[${value.join(', ')}]`
											: `${value}`}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default DynamicModalExample;
