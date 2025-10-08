/**
 * HOOKS
 */

import { useState, useEffect } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';

/**
 * COMPONENTS
 */

import { PhotoProvider, PhotoView } from 'react-photo-view';
import GalleryDisplay from './gallery_display';

export default function ImageUploader({
	previews,
	handleAddPreview,
	handleClearPreview,
	onChange,
}: {
	previews: string[] | undefined;
	handleAddPreview: (acceptedFiles: readonly FileWithPath[]) => void;
	handleClearPreview: () => void;
	onChange: (...event: any[]) => void;
}) {
	const dropzoneSettings = {
		accept: {
			'image/png': ['.png'],
			'image/jpg': ['.jpg', '.jpeg'],
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

	function handleClearImagesClick() {
		handleClearPreview();
	}

	useEffect(() => {
		handleAddPreview(acceptedFiles);
	}, [acceptedFiles]);

	useEffect(() => {
		return () => {
			previews?.forEach((el) => URL.revokeObjectURL(el));
		};
	}, [previews]);

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
