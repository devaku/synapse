import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../../lib/contexts/AuthContext';
// using native buttons in this modal
import Spinner from '../../ui/spinner';
import Button from '../../ui/button';
import { createRepoCollaboratorRequest } from '../../../lib/services/api/github';

type FormValues = {
	repoId: number | string;
	githubUsername: string;
	permission: 'pull' | 'push' | 'admin';
};

export default function AccessCreationModal({
	handleModalDisplay,
	onCreated,
}: {
	handleModalDisplay: () => void;
	onCreated?: () => Promise<void> | void;
}) {
	const { token, serverData } = useAuthContext();
	const { register, handleSubmit } = useForm<FormValues>({
		defaultValues: {
			permission: 'pull',
		},
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	async function onSubmit(data: FormValues) {
		if (!token) {
			alert('You must be logged in to submit a request');
			return;
		}

		if (!serverData?.id) {
			alert(
				'User information not available. Please refresh or login again.'
			);
			return;
		}

		const body = {
			userId: serverData.id,
			repoId: Number(data.repoId),
			permission: data.permission,
			githubUsername: data.githubUsername,
		};

		// Client-side validation
		setSubmitError(null);
		if (
			!data.githubUsername ||
			String(data.githubUsername).trim().length === 0
		) {
			setSubmitError('GitHub username is required');
			return;
		}
		const repoNum = Number(data.repoId);
		if (!repoNum || isNaN(repoNum) || repoNum <= 0) {
			setSubmitError('Repository ID must be a positive number');
			return;
		}

		try {
			setIsSubmitting(true);
			console.log('Creating repo collaborator request with body:', body);
			const resp = await createRepoCollaboratorRequest(token, body);
			console.log('Create response:', resp);
			// optionally call onCreated to refresh lists
			if (onCreated) await onCreated();
			handleModalDisplay();
		} catch (err: unknown) {
			console.error('Failed to create repo request', err);
			let message = 'Failed to create request';
			if (err instanceof Error) message = err.message;
			// show inline error and console details
			setSubmitError(message);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="p-4 min-w-[320px]">
			<div className="mb-4">
				<p className="text-2xl">Request GitHub Access</p>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-3"
			>
				<div className="flex flex-col">
					<label className="text-sm">Repository ID</label>
					<input
						{...register('repoId', { required: true })}
						className="p-2 border rounded-md"
						placeholder="Enter number repository ID"
					/>
				</div>

				<div className="flex flex-col">
					<label className="text-sm">GitHub Username</label>
					<input
						{...register('githubUsername', { required: true })}
						className="p-2 border rounded-md"
						placeholder="github-username"
					/>
				</div>

				<div className="flex flex-col">
					<label className="text-sm">Permission</label>
					<select
						{...register('permission')}
						className="p-2 border rounded-md"
					>
						<option value="pull">Read</option>
						<option value="push">Write</option>
						<option value="admin">Admin</option>
					</select>
				</div>

				<div className="flex gap-2 mt-4">
					<Button
						type="Success"
						text="Submit"
						onClick={() => {}}
					></Button>

					<Button
						type="Info"
						text="Cancel"
						onClick={handleModalDisplay}
					></Button>
				</div>
				{submitError && (
					<div className="mt-2 text-sm text-red-600">
						{submitError}
					</div>
				)}
			</form>

			{isSubmitting && (
				<div className="mt-4">
					<Spinner />
				</div>
			)}
		</div>
	);
}
