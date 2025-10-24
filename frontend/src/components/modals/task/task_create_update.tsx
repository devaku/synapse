/**
 * COMPONENTS
 */

import { type Task, type User } from '../../../lib/types/models';
import { type Team } from '../../../lib/types/models';
import Select from 'react-select';
import Spinner from '../../ui/spinner';
import RHFImageUploader from '../../rhf/rhf_imageuploader';
import RHFImageSelect from '../../rhf/rhf_imageselect';

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
	pictures?: File[];
	removedImages?: number[];
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
		reset,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			pictures: [],
			removedImages: [],
		},
	});

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

	function ProcessSelectOptions(options: OptionType[]) {
		let ids: number[] = [];
		if (options) {
			ids = options.map((el) => {
				return Number(el.value);
			});

			return ids;
		} else {
			return [];
		}
	}

	function buildArrayFormData(
		formData: FormData,
		key: string,
		value: number[]
	) {
		value.map((el) => {
			formData.append(`${key}[]`, el.toString());
		});
	}

	async function handleFormSubmit(data: FormValues) {
		try {
			setIsLoading(true);

			const formData = new FormData();

			/**
			 * VISIBLITY RULES
			 */

			// Get IDs
			let taskHiddenFromUsers: number[] = ProcessSelectOptions(
				getValues('selectTaskHiddenFromUsers')
			);
			let taskVisibleToUsers: number[] = ProcessSelectOptions(
				getValues('selectTaskVisibleToUsers')
			);
			let taskVisibleToTeams: number[] = ProcessSelectOptions(
				getValues('selectTaskVisibleToTeams')
			);

			formData.append('name', data.name);
			formData.append('priority', data.priority);
			formData.append('description', data.description);

			if (taskVisibleToTeams) {
				buildArrayFormData(
					formData,
					'taskVisibleToTeams',
					taskVisibleToTeams
				);
			}

			if (taskVisibleToUsers) {
				buildArrayFormData(
					formData,
					'taskVisibleToUsers',
					taskVisibleToUsers
				);
			}

			if (taskHiddenFromUsers) {
				buildArrayFormData(
					formData,
					'taskHiddenFromUsers',
					taskHiddenFromUsers
				);
			}

			// Attach uploaded pictures, if there are any
			const { pictures } = data;
			if (pictures) {
				pictures.map((el: any) => {
					formData.append('pictures', el);
				});
			}

			// If a taskId was given, it is an update
			if (taskId) {
				const creator = taskReference?.createdByUserId.toString();
				formData.append('createdByUserId', creator!);

				buildArrayFormData(
					formData,
					'taskHiddenFromUsers',
					taskHiddenFromUsers
				);

				// console.log(data.removedImages);

				if (data.removedImages) {
					buildArrayFormData(
						formData,
						'removedImages',
						data.removedImages
					);
				}

				await updateTask(token!, taskId, formData);
			} else {
				// Create the task in the backend
				await createTask(token!, formData);
			}

			// Close modal
			handleModalDisplay();
			setIsLoading(false);
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
							{/* REMOVE Attached Images */}
							{taskReference?.imagesAttachedToTasks &&
							taskReference?.imagesAttachedToTasks.length > 0 ? (
								<div>
									<label className="">
										Existing Attached Images. Click to
										remove.
									</label>
									<div className="grid grid-cols-4 gap-2">
										{taskReference?.imagesAttachedToTasks.map(
											(el, index) => {
												return (
													<Controller
														key={index}
														name="removedImages"
														control={control}
														render={({ field }) => {
															return (
																<RHFImageSelect
																	onChange={
																		field.onChange
																	}
																	imageUrl={
																		el.image
																			.imageUrl
																	}
																	fieldValue={
																		field.value!
																	}
																	imageIndex={
																		el.image
																			.id
																	}
																></RHFImageSelect>
															);
														}}
													></Controller>
												);
											}
										)}
									</div>
								</div>
							) : (
								''
							)}

							{/* UPLOAD IMAGES */}
							<div>
								<label>Attach Images: </label>
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
				</div>
			)}
		</>
	);
}
