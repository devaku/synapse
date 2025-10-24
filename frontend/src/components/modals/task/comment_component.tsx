/**
 * HOOKS
 */

import { useAuthContext } from '../../../lib/contexts/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';

/**
 * COMPONENTS
 */
import CommentCard from '../../ui/comment_card';
import RHFImageUploader from '../../rhf/rhf_imageuploader';

/**
 * SERVICES
 */

import { postComment as createComment } from '../../../lib/services/api/comments';
import { formatDate } from '../../../lib/helpers/datehelpers';

/**
 * TYPES
 */

import type React from 'react';
import { type Comment } from '../../../lib/types/models';
import type { FileWithPath } from 'react-dropzone';

type CommentProps = {
	taskId: number;
	comments: Comment[] | null;
	isSubscribed: boolean;
	children?: React.ReactNode;
};

interface FormValues extends Comment {
	pictures?: File[];
}

/**
 * Integration of react-hook-form with react-gallery-view
 * was made possible with assistance of AI
 */

export default function CommentComponent({
	taskId,
	comments,
	isSubscribed,
	children,
}: CommentProps) {
	const { token, userData, serverData } = useAuthContext();

	const [previews, setPreviews] = useState<string[]>();
	const [internalComments, setInternalComments] = useState<Comment[] | null>(
		comments
	);

	const {
		register,
		handleSubmit,
		control,
		setValue,
		reset,
		getValues,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			pictures: [],
		},
	});
	const [isLoading, setIsLoading] = useState<boolean>(true);

	function loadComments() {
		return internalComments?.map((el, index) => {
			const profilePicture = el.user.image?.imageUrl
				? el.user.image?.imageUrl
				: undefined;

			let imageUrl: string[] = [];
			if (el.imagesAttachedToComments.length > 0) {
				el.imagesAttachedToComments.map((imageElement) => {
					imageUrl.push(imageElement.image.imageUrl);
				});
			}

			return (
				<CommentCard
					key={index}
					images={imageUrl}
					profile_picture_url={profilePicture}
					comment={el.message}
					name={el.user?.email!}
					timestamp={formatDate(new Date(el.createdAt))}
				></CommentCard>
			);
		});
	}

	// Update the local state
	// for new comments
	useEffect(() => {
		setInternalComments(comments);
	}, [comments]);

	async function handleFormSubmit(data: FormValues) {
		// TODO: Add proper handling for error
		try {
			setIsLoading(true);

			// Either have to be available
			if (data.message || data.pictures) {
				let response = await createComment(
					token!,
					taskId,
					data.message,
					data.pictures
				);

				let createdComment: Comment = response[response.length - 1];
				if (internalComments) {
					setInternalComments([createdComment, ...internalComments]);
				} else {
					setInternalComments([createdComment]);
				}

				// Reset the form
				reset();
				// Clear dropzone
				handleClearPreview();
			} else {
				// TODO: Add modal for pop up
				alert(
					'TODO: This needs to be a modal in the future! Message or an image have to be included!'
				);
			}

			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
	}

	function handleClearPreview() {
		previews?.forEach((el) => URL.revokeObjectURL(el));
		setPreviews([]);
	}

	return (
		<>
			<p className="my-2">
				{internalComments && internalComments.length > 0
					? 'Comments:'
					: 'There are currently no comments.'}
			</p>

			{/* INPUT */}
			{/* Input is only displayed if they are subscribed */}
			{isSubscribed ? (
				<div className="p-2 mb-2 rounded-lg shadow-md">
					{/* Profile */}
					<div className="flex items-center gap-2">
						<div className="w-10 h-10">
							<img
								className="rounded-2xl"
								src={
									serverData.image?.imageUrl
										? serverData.image?.imageUrl
										: undefined
								}
								alt=""
								srcSet=""
							/>
						</div>
						<p>{userData.email}</p>
					</div>

					<div className="">
						<form
							onSubmit={handleSubmit(
								async (data) => await handleFormSubmit(data)
							)}
						>
							<div className="flex flex-col gap-2"></div>
							<div className="flex flex-col gap-2">
								<textarea
									className="p-1 w-full"
									id=""
									rows={5}
									maxLength={255}
									placeholder="Enter a description..."
									{...register('message', {
										required: false,
									})}
								></textarea>
							</div>
							<div className="mt-2">
								<Controller
									name={'pictures'}
									control={control}
									render={({ field }) => {
										return (
											<RHFImageUploader
												value={field.value}
												onChange={field.onChange}
											></RHFImageUploader>
										);
									}}
								></Controller>
							</div>

							{/* SUBMIT */}
							<input
								className="w-full cursor-pointer text-center text-black p-2 rounded text-ttg-black bg-green-500 hover:bg-green-700"
								type="submit"
								value="Comment"
							/>
						</form>
					</div>

					{children}
				</div>
			) : (
				''
			)}

			{/* COMMENTS */}
			<div>{loadComments()}</div>
		</>
	);
}
