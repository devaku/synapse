/**
 * HOOKS
 */

import { useAuthContext } from '../../../lib/contexts/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';

/**
 * COMPONENTS
 */
import CommentCard from '../../container/comment_card';
import ImageUploader from '../../ui/image_uploader';

/**
 * SERVICES
 */

import { postComment as createComment } from '../../../lib/services/api/comments';

/**
 * TYPES
 */

import type React from 'react';
import type { Comment } from '../../../lib/types/models';

type CommentProps = {
	comments: Comment[] | null;
	isSubscribed: boolean;
	children?: React.ReactNode;
};

interface FormValues extends Comment {
	pictures?: File[];
}

export default function Comment({
	comments,
	isSubscribed,
	children,
}: CommentProps) {
	const { token, userData } = useAuthContext();

	const {
		register,
		handleSubmit,
		control,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<FormValues>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	function loadComments() {
		return comments?.map((el, index) => {
			return (
				<CommentCard
					key={index}
					profile_picture_url={''}
					comment={el.message}
					name={el.user?.email!}
					timestamp={new Date().toString()}
				></CommentCard>
			);
		});
	}
	async function handleFormSubmit(data: FormValues) {
		try {
			setIsLoading(true);
			// TODO: https://www.youtube.com/watch?v=XlAs-Lid-TA
			// Handling image uploading in the future

			console.log(data);

			await createComment(token!, data.message, data.pictures);
			// console.log(acceptedFiles);

			// Close modal
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
	}

	// const files = acceptedFiles.map((file) => (
	// 	<li key={file.path}>
	// 		{file.path} - {file.size} bytes
	// 	</li>
	// ));

	return (
		<>
			<p className="my-2">
				{comments && comments.length > 0
					? 'Comments:'
					: 'There are currently no comments.'}
			</p>

			{/* INPUT */}
			{/* Input is only displayed if they are subscribed */}
			{isSubscribed ? (
				<div className="p-2 mb-2 rounded-lg shadow-md">
					{/* Profile */}
					<div className="flex items-center gap-2">
						{/* <div className="w-10 h-10">
							<img src={TTGLogo} alt="" srcSet="" />
						</div> */}
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
									className="w-full"
									id=""
									rows={5}
									placeholder="Enter a description..."
									{...register('message', {
										required: false,
									})}
								></textarea>
							</div>
							<Controller
								name={'pictures'}
								control={control}
								render={({ field }) => {
									return (
										<ImageUploader
											onChange={field.onChange}
										></ImageUploader>
									);
								}}
							></Controller>
							{/* SUBMIT */}
							<input
								className="select-none mt-2 py-2 w-full bg-[#153243] text-white border border-[#153243] rounded cursor-pointer"
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
