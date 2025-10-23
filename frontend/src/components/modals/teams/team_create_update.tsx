import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import Spinner from '../../ui/spinner';
import { useAuthContext } from '../../../lib/contexts/AuthContext';
import { readAllUsers } from '../../../lib/services/api/user';
import {
	createTeam,
	getTeams,
	editTeam,
} from '../../../lib/services/api/teams';
import type { User } from '../../../lib/types/models';

type OptionType = { value: number; label: string };

interface FormValues {
	name: string;
	description: string;
	selectTeamMembers: OptionType[];
}

interface TeamData {
	id: number;
	name: string;
	description?: string | null;
	createdBy: number;
	createdAt: Date;
	isDeleted: number;
	createdByUser?: {
		id: number;
		username: string;
		firstName?: string;
		lastName?: string;
	};
	teamsUsersBelongTo?: Array<{
		userId: number;
		teamId: number;
		user: User;
	}>;
}

// Handles both creation and editing of teams with form inputs and user selection.
export default function TeamsCreateUpdateModal({
	modalTitle,
	teamId,
	handleModalDisplay,
}: {
	modalTitle: string;
	teamId?: number;
	handleModalDisplay: () => void;
}) {
	const { token } = useAuthContext();
	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors },
	} = useForm<FormValues>();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [userOptions, setUserOptions] = useState<OptionType[]>([]);
	const [teamReference, setTeamReference] = useState<TeamData | null>(null);

	// Loads users and optionally existing team data for editing.
	// Used AI for this section (lines 62–106)
	// Prompt: "Write a React useEffect that loads user data and pre-fills form fields
	// if editing an existing team. Include inline comments."
	useEffect(() => {
		async function start() {
			if (!token) {
				setIsLoading(false);
				return;
			}

			try {
				await loadUsers();
				if (teamId) {
					const response = await getTeams(token);
					const teamsArray = response.data || response;
					const teamObj = teamsArray.find(
						(t: TeamData) => t.id === teamId
					) as TeamData | undefined;

					if (teamObj) {
						setTeamReference(teamObj);
						setValue('name', teamObj.name);
						setValue('description', teamObj.description || '');

						// Load existing team members
						if (
							teamObj.teamsUsersBelongTo &&
							teamObj.teamsUsersBelongTo.length > 0
						) {
							const members = teamObj.teamsUsersBelongTo.map(
								(membership) => ({
									label: membership.user.username,
									value: membership.user.id,
								})
							);
							setValue('selectTeamMembers', members);
						}
					}
				}
			} catch (err) {
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		}
		start();
	}, [setValue, teamId, token]);

	async function loadUsers() {
		if (!token) return;
		const usersData: User[] = await readAllUsers(token);
		const options = usersData.map((u) => ({
			value: u.id,
			label: u.username,
		}));
		setUserOptions(options);
	}

	function processSelectedUsers(options: OptionType[]) {
		return options?.map((el) => el.value) || [];
	}

	async function handleFormSubmit(data: FormValues) {
		if (!token) return;

		try {
			setIsLoading(true);
			const payload = {
				name: data.name,
				description: data.description,
				users: processSelectedUsers(data.selectTeamMembers),
			};

			if (teamId) {
				await editTeam(token, {
					id: teamId,
					name: payload.name,
					description: payload.description,
					users: payload.users,
				});
			} else {
				await createTeam(token, {
					name: payload.name,
					description: payload.description,
					users: payload.users,
				});
			}

			handleModalDisplay();
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<div className="flex flex-col gap-2 ml-5 pb-2 pr-2 overflow-y-auto h-screen">
					<div className="pt-2">
						<p className="text-2xl">{modalTitle}</p>
					</div>

					{teamId && (
						<div>
							<p className="font-bold">Team Info:</p>
							<p>
								Created By:{' '}
								{teamReference?.createdByUser?.username}
							</p>
						</div>
					)}

					<form onSubmit={handleSubmit(handleFormSubmit)}>
						<div className="flex flex-col gap-2">
							<label>Group Name:</label>
							<input
								placeholder="Enter team name..."
								className="p-1 border border-gray-500 rounded-md"
								{...register('name', { required: true })}
							/>
							{errors.name && (
								<span className="text-red-500">Required</span>
							)}
						</div>

						<div className="flex flex-col gap-2">
							<label>Group Description:</label>
							<textarea
								placeholder="Enter a description..."
								className="p-1 border border-gray-500 rounded-md"
								rows={4}
								{...register('description', { required: true })}
							/>
							{errors.description && (
								<span className="text-red-500">Required</span>
							)}
						</div>

						<div className="flex flex-col gap-2">
							<label>Team Members:</label>
							<Controller
								control={control}
								name="selectTeamMembers"
								render={({ field }) => (
									<Select
										{...field}
										className="w-full"
										isMulti
										classNamePrefix="react-select"
										options={userOptions}
										onChange={(selected) =>
											field.onChange(selected)
										}
										placeholder="Choose users..."
									/>
								)}
							/>
						</div>

						<div className="flex flex-col gap-2 mt-2">
							<input
								className="w-full cursor-pointer text-center p-2 rounded text-ttg-black bg-green-500 hover:bg-green-700"
								type="submit"
								value="SUBMIT"
							/>
							<input
								onClick={() => handleModalDisplay()}
								type="button"
								className="w-full cursor-pointer text-center p-2 rounded text-ttg-white bg-ttg-brown/70 hover:bg-ttg-brown"
								value="BACK"
							/>
						</div>
					</form>
				</div>
			)}
		</>
	);
}
