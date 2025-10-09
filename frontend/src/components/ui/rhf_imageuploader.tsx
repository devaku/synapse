/**
 * HOOKS
 */
import { useEffect, useState } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';

/**
 * COMPONENTS
 */
import GalleryDisplay from './gallery_display';

export default function RHFImageUploader({
	value,
	onChange,
}: {
	value: File[] | undefined;
	onChange: (files: any[]) => void;
}) {
	const [previews, setPreviews] = useState<string[]>();
	const dropzoneSettings = {
		accept: {
			'image/png': ['.png'],
			'image/jpg': ['.jpg', '.jpeg'],
			'image/gif': ['.gif'],
		},
		multiple: true,
	};

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		...dropzoneSettings,
		onDrop: (acceptedFiles: any) => {
			onChange(acceptedFiles);
		},
		noDrag: true,
		noKeyboard: true,
	});

	/**
	 * EFFECTS
	 */

	// When reset() is called from the hook form
	// value will be passed down and will trigger this
	useEffect(() => {
		// Reset the previews
		if (value?.length == 0) {
			setPreviews([]);
		}
	}, [value]);

	useEffect(() => {
		handleAddPreview(acceptedFiles);
	}, [acceptedFiles]);

	useEffect(() => {
		return () => {
			previews?.forEach((el) => URL.revokeObjectURL(el));
		};
	}, [previews]);

	/**
	 * HANDLERS
	 *
	 */

	function handleClearImagesClick() {
		handleClearPreview();
	}
	function handleAddPreview(acceptedFiles: readonly FileWithPath[]) {
		let urls = acceptedFiles.map((el: any) => {
			let imageUrl = URL.createObjectURL(el);
			return imageUrl;
		});
		setPreviews(urls);
	}

	function handleClearPreview() {
		previews?.forEach((el) => URL.revokeObjectURL(el));
		setPreviews([]);
	}

	return (
		<>
			<GalleryDisplay images={previews}></GalleryDisplay>
			{previews && previews.length > 0 ? (
				<div>
					<button
						onClick={handleClearImagesClick}
						className="select-none mt-2 py-2 w-full bg-[#153243] text-white border border-[#153243] rounded cursor-pointer"
					>
						Clear Images
					</button>
				</div>
			) : (
				''
			)}

			<div
				{...getRootProps({
					className:
						'cursor-pointer my-2 p-2 text-center border-2 border-gray-400',
				})}
			>
				<input {...getInputProps()} />
				<p>Upload images</p>
			</div>
		</>
	);
}
