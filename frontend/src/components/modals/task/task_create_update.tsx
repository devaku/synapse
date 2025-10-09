/**
 * COMPONENTS
 */

import { type Task, type User } from '../../../lib/types/models';
import Select, { type MultiValue } from 'react-select';
import { type Team } from '../../../lib/types/models';
import Spinner from '../../ui/spinner';

/**
 * HOOKS
 */

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuthContext } from '../../../lib/contexts/AuthContext';

/**
 * SERVICES / HELPERS
 */

import { getTeams } from '../../../lib/services/api/teams';
import { readAllUsers } from '../../../lib/services/api/user';
import {
	createTask,
	readTask,
	updateTask,
} from '../../../lib/services/api/task';
import { formatDate } from '../../../lib/helpers/datehelpers';

/**
 * Disclaimer:
 * Integration of react-select and react-hook-form was aided by AI
 */

// Define the shape of an option
type OptionType = {
	value: string | number;
	label: string;
};

interface FormValues extends Task {
	selectTaskVisibleToTeams: OptionType[];
	selectTaskVisibleToUsers: OptionType[];
	selectTaskHiddenFromUsers: OptionType[];
}

export default function TaskCreateUpdateModal({
	modalTitle,
	taskId,
	handleModalDisplay,
}: {
	modalTitle: string;
	taskId?: number;
	handleModalDisplay: () => void;
}) {
	const { token } = useAuthContext();
	const {
		register,
		handleSubmit,
		control,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<FormValues>();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [taskReference, setTaskReference] = useState<Task | null>(null);

	/**
	 * STATES FOR THE REACT SELECT
	 */

	// Options are the ones that are just being displayed
	const [visibleTeamsOptions, setVisibleTeamsOptions] = useState<
		OptionType[]
	>([]);

	const [visibleUserOptions, setVisibleUserOptions] = useState<OptionType[]>(
		[]
	);

	const [hiddenUserOptions, setHiddenUserOptions] = useState<OptionType[]>(
		[]
	);

	/**
	 * INTERNAL FUNCTIONS
	 */

	// Load the options
	useEffect(() => {
		async function start() {
			// TODO: Proper handling of errors from API requests
			try {
				await loadOptions();
				if (taskId) {
					let data = await readTask(token!, taskId);
					let taskObj: Task = data[0];
					setValue('name', taskObj.name);
					setValue('priority', taskObj.priority);
					setValue('description', taskObj.description);

					setTaskReference(taskObj);

					// VISIBLITY RULES
					if (taskObj.taskVisibleToTeams) {
						let ids = taskObj.taskVisibleToTeams.map((el) => {
							return {
								label: el.team!.name,
								value: el.team!.id,
							};
						});

						setValue('selectTaskVisibleToTeams', ids);
					}

					if (taskObj.taskVisibleToUsers) {
						let ids = taskObj.taskVisibleToUsers.map((el) => {
							return {
								label: el.user!.username,
								value: el.user!.id,
							};
						});

						setValue('selectTaskVisibleToUsers', ids);
					}

					if (taskObj.taskHiddenFromUsers) {
						let ids = taskObj.taskHiddenFromUsers.map((el) => {
							return {
								label: el.user!.username,
								value: el.user!.id,
							};
						});

						setValue('selectTaskHiddenFromUsers', ids);
					}
				}

				setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		}
		start();
	}, [setValue]);

	/**
	 * This function will populate the dropdowns
	 */
	async function loadOptions() {
		// Fetch the teams
		let response = await getTeams(token!);
		let teamsData: Team[] = response.data;
		let teamOptions: OptionType[] = teamsData.map((el) => {
			return { value: el.id, label: el.name };
		});

		setVisibleTeamsOptions(teamOptions);

		// Fetch the users
		let usersData: User[] = await readAllUsers(token!);
		const userOptions: OptionType[] = usersData.map((el) => {
			return { value: el.id, label: el.username };
		});

		setVisibleUserOptions(userOptions);
		setHiddenUserOptions(userOptions);
	}

	/**
	 * HANDLERS
	 */

	async function handleFormSubmit(data: FormValues) {
		try {
			setIsLoading(true);
			// TODO: https://www.youtube.com/watch?v=XlAs-Lid-TA
			// Handling image uploading in the future

			// TODO: Add proper error handling from API call

			/**
			 * VISIBLITY RULES
			 */

			// Get IDs
			let taskHiddenFromUsers: number[] = [];
			let thu = getValues('selectTaskHiddenFromUsers');
			if (thu) {
				taskHiddenFromUsers = thu.map((el) => {
					return Number(el.value);
				});
			} else {
				taskHiddenFromUsers = [];
			}

			let taskVisibleToUsers: number[] = [];
			let tvu = getValues('selectTaskVisibleToUsers');
			if (tvu) {
				taskVisibleToUsers = tvu.map((el) => {
					return Number(el.value);
				});
			} else {
				taskVisibleToUsers = [];
			}

			let taskVisibleToTeams: number[] = [];
			let tvt = getValues('selectTaskVisibleToTeams');
			if (tvt) {
				taskVisibleToTeams = tvt.map((el) => {
					return Number(el.value);
				});
			} else {
				taskVisibleToTeams = [];
			}

			let finalTaskObj: any = {};

			// Begin mapping data
			finalTaskObj.name = data.name;
			finalTaskObj.priority = data.priority;
			finalTaskObj.description = data.description;
			finalTaskObj.taskVisibleToTeams = taskVisibleToTeams;
			finalTaskObj.taskVisibleToUsers = taskVisibleToUsers;
			finalTaskObj.taskHiddenFromUsers = taskHiddenFromUsers;

			// If a taskId was given, it is an update
			if (taskId) {
				finalTaskObj.createdByUserId = taskReference?.createdByUserId;

				// console.log(finalTaskObj);
				await updateTask(token!, taskId, finalTaskObj);
			} else {
				// Create the task in the backend
				await createTask(token!, finalTaskObj);
			}

			// Close modal
			handleModalDisplay();
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
	}

	return (
		<>
			{isLoading ? (
				<Spinner></Spinner>
			) : (
				<div className="flex flex-col gap-2 ml-5 pb-2 pr-2 overflow-y-auto h-screen">
					{/* TITLE */}
					<div className="pt-2">
						<p className="text-2xl">{modalTitle}</p>
					</div>
					{/* INFORMATION */}
					{taskId ? (
						<div className="">
							<p className="font-bold">Task Information: </p>
							<p>
								Created By:{' '}
								{taskReference?.createdByUser?.username}
							</p>
							<p>
								Created On:{' '}
								{formatDate(
									new Date(taskReference?.createdAt!)
								)}
							</p>
						</div>
					) : (
						''
					)}

					{/* FORM */}
					<div className="">
						<form
							onSubmit={handleSubmit(
								async (data) => await handleFormSubmit(data)
							)}
						>
							<div className="flex flex-col gap-2">
								<label className="">Task Name:</label>
								<input
									placeholder="Enter a name for the task..."
									className="p-1 grow border border-gray-500 rounded-md"
									{...register('name', { required: true })}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<label className="">Priority Status:</label>
								<select
									className="p-1 border border-gray-500 rounded-md"
									id=""
									{...register('priority', {
										required: true,
									})}
								>
									<option value="LOW">LOW</option>
									<option value="MEDIUM">MEDIUM</option>
									<option value="HIGH">HIGH</option>
									<option value="URGENT">URGENT</option>
								</select>
							</div>
							<div>
								<label>Description: </label>
								<textarea
									className="w-full p-1 border border-gray-500 rounded-md"
									id=""
									rows={5}
									placeholder="Enter a description..."
									{...register('description', {
										required: true,
									})}
								></textarea>
							</div>

							{/* VISIBILITY RULES */}
							<div className="">Visibility Rules</div>
							<div className="">
								<div className="flex flex-col">
									<div className="min-w-32">
										Visible To Teams:{' '}
									</div>
									<Controller
										control={control}
										name="selectTaskVisibleToTeams"
										render={({ field }) => (
											<Select
												{...field}
												className="w-full"
												isMulti
												classNamePrefix="react-select"
												value={field.value}
												options={visibleTeamsOptions}
												isClearable={true}
												onChange={(selected) =>
													field.onChange(selected)
												}
												placeholder="Choose teams..."
											/>
										)}
									></Controller>
								</div>
								<div className="flex flex-col">
									<div className="min-w-32">
										Visible To Users:{' '}
									</div>
									<Controller
										control={control}
										name="selectTaskVisibleToUsers"
										render={({ field }) => (
											<Select
												{...field}
												className="w-full"
												isMulti
												classNamePrefix="react-select"
												value={field.value}
												options={visibleUserOptions}
												isClearable={true}
												onChange={(selected) =>
													field.onChange(selected)
												}
												placeholder="Choose users..."
											/>
										)}
									></Controller>
								</div>
								<div className="flex flex-col">
									<div className="min-w-32">
										Hidden From Users:{' '}
									</div>
									<Controller
										control={control}
										name="selectTaskHiddenFromUsers"
										render={({ field }) => (
											<Select
												{...field}
												className="w-full"
												isMulti
												classNamePrefix="react-select"
												value={field.value}
												options={hiddenUserOptions}
												isClearable={true}
												onChange={(selected) =>
													field.onChange(selected)
												}
												placeholder="Choose users..."
											/>
										)}
									></Controller>
								</div>
							</div>

							{/* SUBMIT */}
							<input
								className="select-none mt-2 py-2 w-full bg-[#153243] text-white border border-[#153243] rounded cursor-pointer"
								type="submit"
								value="SUBMIT"
							/>
							<input
								onClick={() => handleModalDisplay()}
								type="button"
								className="select-none mt-2 text-center py-2 w-full bg-[#431815] text-white border border-[#153243] rounded cursor-pointer"
								value="BACK"
							/>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
