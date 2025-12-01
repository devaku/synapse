import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import RHFVideoUploader from '../components/rhf/rhf_videouploader';

export default function DebugPage() {
	interface FormValues {
		videoFiles: File[];
	}

	const { register, handleSubmit, control } = useForm<FormValues>({
		defaultValues: {
			videoFiles: [],
		},
	});

	const images = [
		'http://localhost:8080/public/uploads/2025-10-10-154101-a4feae2b-f0f1-4a6d-b686-40590cc29a22.jpeg',
		'http://localhost:8080/public/uploads/2025-10-10-154101-d17974d0-64df-4005-b577-5f7ff9cc2054.png',
		'http://localhost:8080/public/uploads/2025-10-10-154101-e1d1af7b-c9d4-4a38-bd81-86dfa6f3163a.jpeg',
	];

	const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

	function handleImageClick(
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		index: number
	) {
		// If it is in the array, remove it
		if (removedImageIds.includes(index)) {
			let newArray = removedImageIds.filter((el) => {
				return el != index;
			});

			setRemovedImageIds(newArray);
		} else {
			setRemovedImageIds([...removedImageIds, index]);
		}
	}

	function handleFormSubmit(data: FormValues) {
		console.log(data);
	}
	return (
		<div className="p-10">
			<div>This is the debug page</div>
			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<div className="flex gap-2">
					<Controller
						name="videoFiles"
						control={control}
						render={({ field }) => {
							return (
								<RHFVideoUploader
									value={field.value}
									onChange={field.onChange}
								></RHFVideoUploader>
							);
						}}
					></Controller>
				</div>
				<input className="bg-red-400" type="submit" value="SUBMIT" />
			</form>
		</div>
	);
}
