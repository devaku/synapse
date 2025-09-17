import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';

export interface FieldMetadata {
	name: string;
	type: 'string' | 'text' | 'number' | 'boolean';
}

interface DynamicModalProps {
	metadata: FieldMetadata[];
	onStateChange?: (formData: FormData) => void;
}

type FormDataValue = string | number | boolean | any[] | null;

interface FormData {
	[key: string]: FormDataValue;
}

// Renders the input fields from the metadata to later build the form
// Returns react elements for each field type
// TODO: We need to add the styles and define what types of inputs we need
// METADATA example:
// {"taskForm": [
//     {
//       "name": "title",
//       "type": "string"
//     },
//     {
//       "name": "description",
//       "type": "text"
//     },
//     {
//       "name": "priority",
//       "type": "number"
//     },
//     {
//       "name": "isCompleted",
//       "type": "boolean"
//     },
//     {
//       "name": "tags",
//       "type": "array"
//     },
//     {
//       "name": "estimatedHours",
//       "type": "number"
//     }
//   ],}

const renderInput = (
	field: FieldMetadata,
	value: FormDataValue,
	onChange: (fieldName: string, value: FormDataValue) => void
): ReactElement => {
	switch (field.type) {
		case 'string':
		case 'text':
			return (
				<input
					key={field.name}
					type="text"
					value={String(value || '')}
					onChange={(e) => onChange(field.name, e.target.value)}
				/>
			);

		case 'number':
			return (
				<input
					key={field.name}
					type="number"
					value={Number(value || 0)}
					onChange={(e) =>
						onChange(field.name, Number(e.target.value))
					}
				/>
			);

		case 'boolean':
			return (
				<input
					key={field.name}
					type="checkbox"
					checked={Boolean(value)}
					onChange={(e) => onChange(field.name, e.target.checked)}
				/>
			);

		default:
			return (
				<input
					key={field.name}
					type="text"
					value={String(value || '')}
					onChange={(e) => onChange(field.name, e.target.value)}
				/>
			);
	}
};

const DynamicModal = ({ metadata, onStateChange }: DynamicModalProps) => {
	// Create a single state object with all dynamic fields
	const [formData, setFormData] = useState<FormData>({});

	// Initialize state when metadata changes
	// OBS: We could even add a tab selection inside the modal and then change the state that way instead of closing the modal
	// and reopening it
	useEffect(() => {
		if (metadata) {
			const initialState: FormData = {};
			metadata.forEach((field) => {
				// Set default values based on type
				switch (field.type) {
					case 'string':
					case 'text':
						initialState[field.name] = '';
						break;
					case 'number':
						initialState[field.name] = 0;
						break;
					case 'boolean':
						initialState[field.name] = false;
						break;
					default:
						initialState[field.name] = null;
				}
			});
			setFormData(initialState);
		}
	}, [metadata]);

	// Notify parent component when form data changes
	// This way we can make the API call in the parent component
	useEffect(() => {
		if (onStateChange) {
			onStateChange(formData);
		}
	}, [formData, onStateChange]);

	// Generic handler for updating any field
	const handleFieldChange = (fieldName: string, value: FormDataValue) => {
		setFormData((prev) => ({
			...prev,
			[fieldName]: value,
		}));
	};

	return (
		<div>
			{metadata?.map((field) => (
				<div key={field.name}>
					<label>{field.name}</label>
					{renderInput(
						field,
						formData[field.name],
						handleFieldChange
					)}
				</div>
			))}
		</div>
	);
};

export default DynamicModal;
