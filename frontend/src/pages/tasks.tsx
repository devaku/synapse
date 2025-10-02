import * as _ from 'lodash';

/**
 * COMPONENTS
 */
import StatusPill from '../components/ui/status_pill';
import SvgComponent from '../components/ui/svg_component';

import HeaderContainer from '../components/container/header_container';
import SlideModalContainer from '../components/container/modal_containers/slide_modal_container';
import DynamicForm, { type FieldMetadata } from '../components/ui/dynamic_form';

import TaskCreateModal from '../components/modals/task/task_create';
import DataTable, { type TableColumn } from 'react-data-table-component';
import type { Task } from '../lib/types/models';

/**
 * DATA
 */
import schema from '../assets/schemas/schema.json';

/**
 * HOOKS
 */
import { useModal } from '../lib/hooks/ui/useModal';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../lib/contexts/AuthContext';

/**
 * SERVICES / HELPERS
 */

import { readTasksFilteredForUser, deleteTask } from '../lib/services/api/task';
import { formatDate } from '../lib/helpers/datehelpers';

export default function TasksPage() {
	const { token } = useAuthContext();

	const [formState, setFormState] = useState<Record<string, any>>({});
	// Handle form state updates from the dynamic modal
	const handleFormStateChange = (newState: Record<string, any>) => {
		setFormState(newState);
	};

	/**
	 * There are two states for keeping track of table content
	 * because when it is filtered, it returns a new set of arrays
	 * and we need to remember what the original array was to revert it
	 * back to its original state
	 */
	const [myTaskData, setTaskData] = useState<Task[]>([]);
	const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

	// States used to keep track of the respective
	// texts in the SEARCH BARS
	const [filterTextTasks, setFilterTextTasks] = useState('');

	// Hooks for opening and closing modals
	const modalTaskInfo = useModal();

	// Used to fetch the data that would populate the opened modal
	const [modalTaskInfoId, setModalTaskInfoId] = useState(0);

	const modalTaskCreate = useModal();
	const [modalTaskCreateId, setmodalTaskCreateId] = useState(0);

	const modalTaskUpdate = useModal();
	const [modalTaskUpdateId, setModalTaskUpdateId] = useState(0);

	/**
	 * HARD CODED COLUMNS FOR THE TABLES
	 */

	const taskColumns: TableColumn<Task>[] = [
		{
			name: 'ID',
			selector: (row) => row.id,
			sortable: true,
		},
		{
			name: 'Task',
			selector: (row) => row.name,
			sortable: true,
		},
		{
			name: 'Created At',
			selector: (row: Task) => {
				return formatDate(new Date(row.createdAt!));
			},
			sortable: true,
		},
		{
			name: 'Status',
			selector: (row) => row.priority,
			sortable: true,
			cell: (row) => <StatusPill text={row.priority}></StatusPill>,
		},
		{
			name: 'Actions',
			cell: (row) => (
				<div className="flex gap-2">
					<button
						className="cursor-pointer w-6 h-6"
						onClick={() => handleTaskClickInfo(row)}
					>
						<SvgComponent iconName="INFO" className="" />
					</button>
					<button
						className="cursor-pointer w-6 h-6"
						onClick={() => handleTaskClickUpdate(row)}
					>
						<SvgComponent iconName="WRENCH" className="" />
					</button>
				</div>
			),
		},
	];

	/**
	 * USE EFFECTS
	 */

	// Initial Load
	useEffect(() => {
		async function start() {
			await refreshTable();
		}
		start();
	}, []);

	// refresh table after closing or creating if you want
	useEffect(() => {
		async function start() {
			await refreshTable();
		}
		start();
	}, [modalTaskCreate.isOpen, modalTaskUpdate.isOpen]);

	/**
	 * USE EFFECT to handling FILTERING
	 * of the tables
	 */
	useEffect(() => {
		/**
		 * Filtering is matching
		 * based on id, name, and priority
		 */
		const taskResult = myTaskData.filter((item: Task) => {
			return (
				(item.id &&
					item.id
						.toString()
						.toLowerCase()
						.includes(filterTextTasks.toLowerCase())) ||
				(item.name &&
					item.name
						.toLowerCase()
						.includes(filterTextTasks.toLowerCase())) ||
				(item.priority &&
					item.priority
						.toLowerCase()
						.includes(filterTextTasks.toLowerCase()))
			);
		});
		setFilteredTasks(taskResult);
	}, [filterTextTasks]);

	/**
	 * INTERNAL FUNCTIONS
	 */

	async function refreshTable() {
		// TODO: API requests will throw an error if there was a problem
		let subscribedTaskRows = await readTasksFilteredForUser(token!);

		setFilteredTasks(subscribedTaskRows);
		setTaskData(subscribedTaskRows);
	}

	/**
	 * HANDLERS
	 */

	function handleTaskClickInfo(row: Task) {
		setModalTaskInfoId(row.id);
		modalTaskInfo.open();
	}

	function handleTaskClickCreate(row: Task) {
		setmodalTaskCreateId(row.id);
		modalTaskCreate.open();
	}

	function handleTaskClickUpdate(row: Task) {
		setModalTaskUpdateId(row.id);
		modalTaskUpdate.open();
	}

	return (
		<>
			<HeaderContainer pageTitle={'Tasks'}>
				{/* Tasks Table */}
				<div className="flex flex-col">
					<div>
						{/* Search Bar */}
						<div className="">
							<input
								type="text"
								placeholder="Search My Tasks..."
								className="mb-4 p-2 border rounded border-gray-300 w-50"
								value={filterTextTasks}
								onChange={(e) =>
									setFilterTextTasks(e.target.value)
								}
							/>
							<button
								className="py-2 px-3 bg-[#153243] text-white border border-[#153243] rounded ml-1 cursor-pointer"
								onClick={() => {
									setFilterTextTasks('');
								}}
							>
								X
							</button>
							<button
								className="py-2 px-3 bg-[#153243] text-white border border-[#153243] rounded ml-1 cursor-pointer"
								onClick={() => modalTaskCreate.open()}
							>
								Create Task
							</button>
						</div>
						<div className="">
							<DataTable
								columns={taskColumns}
								data={filteredTasks}
								fixedHeader={true}
								highlightOnHover={true}
								dense={true}
								pagination
								fixedHeaderScrollHeight="400px"
								className="border border-gray-200 mb-10"
							/>
						</div>
					</div>
				</div>
			</HeaderContainer>

			{/* Create Modal */}
			<SlideModalContainer isOpen={modalTaskCreate.isOpen} noFade={false}>
				<TaskCreateModal
					handleModalDisplay={modalTaskCreate.toggle}
				></TaskCreateModal>
			</SlideModalContainer>

			{/* Read Modal */}
			<SlideModalContainer isOpen={modalTaskInfo.isOpen} noFade={false}>
				<DynamicForm
					metadata={schema['CreateEditTask'] as FieldMetadata[]}
					onStateChange={handleFormStateChange}
				/>
				<button
					className="cursor-pointer w-6 h-6 bg-red-600"
					onClick={modalTaskInfo.toggle} // new hook handles open/close
				></button>
			</SlideModalContainer>

			{/* Update Modal */}
			<SlideModalContainer isOpen={modalTaskUpdate.isOpen} noFade={false}>
				<DynamicForm
					metadata={schema['CreateEditTask'] as FieldMetadata[]}
					onStateChange={handleFormStateChange}
				/>
				<button
					className="cursor-pointer w-6 h-6 bg-red-600"
					onClick={modalTaskUpdate.toggle} // new hook handles open/close
				></button>
			</SlideModalContainer>
		</>
	);
}
