import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../../lib/contexts/AuthContext';
// using native buttons in this modal
import Spinner from '../../ui/spinner';
import Button from '../../ui/button';
import { createRepoCollaboratorRequest, getGithubRepos } from '../../../lib/services/api/github';
import DataTable from '../../container/DataTableBase'

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
	const { register, handleSubmit, setValue } = useForm<FormValues>({
		defaultValues: {
			permission: 'pull',
		},
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [repos, setRepos] = useState<any[]>([]);
	const [selectedRepoId, setSelectedRepoId] = useState<number | null>(null);
	const [isLoadingRepos, setIsLoadingRepos] = useState<boolean>(false);
	const [fetchError, setFetchError] = useState<string | null>(null);

	React.useEffect(() => {
		let mounted = true;
		async function load() {
			// If no token, don't attempt authenticated fetch; prompt user to login
			if (!token) {
				if (!mounted) return;
				setRepos([]);
				setFetchError('Please sign in to view repositories');
				setIsLoadingRepos(false);
				return;
			}
			setIsLoadingRepos(true);
			setFetchError(null);
			try {
				const r = await getGithubRepos(token ?? undefined);
				if (!mounted) return;
				if (Array.isArray(r)) setRepos(r);
				else {
					setRepos([]);
					setFetchError('No repositories returned from server');
				}
			} catch (e: any) {
				console.error('Failed to load github repos', e);
				if (!mounted) return;
				setRepos([]);
				setFetchError(e?.message || String(e));
			} finally {
				setIsLoadingRepos(false);
			}
		}
		load();
		return () => {
			mounted = false;
		};
	}, [token]);

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

		const repoToUse = selectedRepoId ?? Number(data.repoId);
		const body = {
			userId: serverData.id,
			repoId: Number(repoToUse),
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
		const repoNumToCheck = Number(repoToUse);
		if (!repoNumToCheck || isNaN(repoNumToCheck) || repoNumToCheck <= 0) {
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

	const columns = [
		{ name: 'ID', selector: (row: any) => row.id, sortable: true, width: '120px' },
		{ name: 'Name', selector: (row: any) => row.name, sortable: true },
		{ name: 'Full name', selector: (row: any) => row.full_name, sortable: true },
		{ name: 'Private', selector: (row: any) => (row.private ? 'Yes' : 'No'), sortable: true },
	];

	return (
		<div className="p-4">
			<div className="mb-4 w-fit">
				<p className="text-2xl">Request GitHub Access</p>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-3"
			>
				<div className="flex flex-col">
						<div className="h-64">
							<div className="mb-2 text-sm text-gray-600">
								{isLoadingRepos ? 'Loading repositories...' : `Repositories: ${repos.length}`}
								{fetchError && (
									<div className="text-sm text-red-600">{fetchError}</div>
								)}
							</div>
							<DataTable
								columns={columns}
								data={repos}
								// allow clicking rows to select
								onRowClicked={(row: any) => {
									const id = Number(row.id);
									setSelectedRepoId(id);
									setValue('repoId', id);
								}}
								conditionalRowStyles={[
									{
										when: (row: any) => selectedRepoId === Number(row.id),
										style: { backgroundColor: 'rgba(34,197,94,0.12)' },
									},
								]}
								// enable pointer and hover via DataTable defaults
							/>
						</div>
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
						<option value="pull">Pull</option>
						<option value="push">Push</option>
						<option value="maintain">Maintain</option>
						<option value="admin">Admin</option>
					</select>
				</div>

				<div className="flex gap-2 mt-4">
					<Button
						type="Success"
						text="Submit"
						onClick={() => void handleSubmit(onSubmit)()}
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
