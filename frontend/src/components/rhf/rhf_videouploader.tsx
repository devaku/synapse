/**
 * HOOKS
 */
import { useEffect, useState } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import ReactPlayer from 'react-player';

/**
 * COMPONENTS
 */
import GalleryDisplay from '../ui/gallery_display';
import Button from '../ui/button';

export default function RHFVideoUploader({
	value,
	onChange,
}: {
	value: File[] | undefined;
	onChange: (files: any[]) => void;
}) {
	const [previews, setPreviews] = useState<string[]>();
	const [video, setVideo] = useState<string>();
	const dropzoneSettings = {
		accept: {
			'video/mp4': ['.mp4'],
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

	function handleClearVideosClick() {
		onChange([]);
		setVideo('');
		handleClearPreview();
	}

	function handleVideoPlay(videoIndex: number) {
		setVideo(previews![videoIndex]);
	}

	function handleAddPreview(acceptedFiles: readonly FileWithPath[]) {
		let urls = acceptedFiles.map((el) => {
			let videoUrl = URL.createObjectURL(el);
			return videoUrl;
		});
		setPreviews(urls);
	}

	function handleClearPreview() {
		setPreviews([]);
	}

	return (
		<>
			{previews && previews.length > 0 ? (
				<div>
					<div>
						<p>VIDEOS</p>
						<div className="flex flex-col gap-2">
							{previews.map((el: any, index: number) => {
								return (
									<Button
										key={index}
										type="Success"
										text={el}
										className="cursor-pointer"
										onClick={() => handleVideoPlay(index)}
									></Button>
								);
							})}
						</div>
					</div>
					<div className="mt-4">
						<Button
							type="Danger"
							text="Clear videos"
							className="select-none"
							onClick={handleClearVideosClick}
						></Button>
					</div>
				</div>
			) : (
				''
			)}

			{video ? (
				<div>
					<ReactPlayer controls={true} src={video}></ReactPlayer>
				</div>
			) : (
				<></>
			)}

			<div
				{...getRootProps({
					className:
						'cursor-pointer my-2 p-2 text-center border-2 border-gray-400',
				})}
			>
				<input {...getInputProps()} />
				<p>Upload videos</p>
			</div>
		</>
	);
}
