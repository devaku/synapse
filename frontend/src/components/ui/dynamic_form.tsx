import { useState, useEffect, useRef } from 'react';
import type { ReactElement } from 'react';

export interface FieldMetadata {
	name: string;
	label: 'string';
	type: 'string' | 'text' | 'number' | 'boolean';
}

interface DynamicModalProps {
	metadata: FieldMetadata[];
	initialData?: FormData;
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
			return (
				<input
					key={field.name}
					type="text"
					value={String(value || '')}
					onChange={(e) => onChange(field.name, e.target.value)}
					className="border-2 border-gray-300 p-2 rounded w-full"
					placeholder={`Enter ${field.name}`}
				/>
			);

		case 'text':
			return (
				<textarea
					key={field.name}
					value={String(value || '')}
					onChange={(e) => onChange(field.name, e.target.value)}
					className="border-2 border-gray-300 p-2 rounded w-full resize-none"
					rows={4}
					placeholder={`Enter ${field.name}`}
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
					className="border-2 border-gray-300 p-2 rounded w-full"
					placeholder={`Enter ${field.name}`}
				/>
			);

		case 'boolean':
			return (
				<input
					key={field.name}
					type="checkbox"
					checked={Boolean(value)}
					onChange={(e) => onChange(field.name, e.target.checked)}
					className="w-4 h-4"
				/>
			);

		default:
			return (
				<input
					key={field.name}
					type="text"
					value={String(value || '')}
					onChange={(e) => onChange(field.name, e.target.value)}
					className="border-2 border-gray-300 p-2 rounded w-full"
					placeholder={`Enter ${field.name}`}
				/>
			);
	}
};

const DynamicForm = ({
	metadata,
	initialData,
	onStateChange,
}: DynamicModalProps) => {
	// Create a single state object with all dynamic fields
	const [formData, setFormData] = useState<FormData>({});
	const initializedRef = useRef(false);

	// Initialize state only once when component mounts
	useEffect(() => {
		if (metadata && !initializedRef.current) {
			const initialState: FormData = {};
			metadata.forEach((field) => {
				// Use initialData if provided, otherwise set default values based on type
				if (initialData && initialData[field.name] !== undefined) {
					initialState[field.name] = initialData[field.name];
				} else {
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
				}
			});
			setFormData(initialState);
			initializedRef.current = true;

			// Call onStateChange once after initialization
			if (onStateChange) {
				onStateChange(initialState);
			}
		}
	}, [metadata, initialData, onStateChange]);

	// Reset initialization flag when component unmounts
	useEffect(() => {
		return () => {
			initializedRef.current = false;
		};
	}, []);

	// Generic handler for updating any field
	const handleFieldChange = (fieldName: string, value: FormDataValue) => {
		const newFormData = {
			...formData,
			[fieldName]: value,
		};
		setFormData(newFormData);

		// Notify parent immediately when user makes changes
		if (onStateChange && initializedRef.current) {
			onStateChange(newFormData);
		}
	};

	return (
		<div className="space-y-4">
			{metadata?.map((field) => (
				<div key={field.name} className="flex flex-col">
					<label className="mb-2 font-medium text-gray-700 capitalize">
						{field.label
							? field.label.replace(/_/g, ' ')
							: field.name.replace(/_/g, ' ')}
						:
					</label>
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

export default DynamicForm;
