import * as _ from 'lodash';

/**
 * COMPONENTS
 */
import StatusPill from '../components/ui/status_pill';
import SvgComponent from '../components/ui/svg_component';

import HeaderContainer from '../components/container/header_container';
import SlideModalContainer from '../components/container/modal_containers/slide_modal_container';
import MyTaskModalHeader from '../components/modals/my_tasks/my_task_header';
import MyTaskReadModal from '../components/modals/my_tasks/my_task_read';

import { type TableColumn } from 'react-data-table-component';
import DataTable from '../components/container/DataTableBase';

import type { Task } from '../lib/types/models';

/**
 * HOOKS
 */
import { useModal } from '../lib/hooks/ui/useModal';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../lib/contexts/AuthContext';

/**
 * SERVICES / HELPERS
 */

import {
	readTask,
	readTasksFilteredForUser,
	deleteTask,
} from '../lib/services/api/task';
import { formatDate } from '../lib/helpers/datehelpers';
import TaskCreateUpdateModal from '../components/modals/task/task_create_update';

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
	}, [modalTaskCreate.isOpen, modalTaskInfo.isOpen, modalTaskUpdate.isOpen]);

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
					</div>
				</div>
				<div className="min-h-0 flex flex-col">
					<DataTable
						title="Available Tasks"
						fixedHeader={true}
						dense={true}
						highlightOnHover={true}
						columns={taskColumns}
						data={filteredTasks}
						defaultSortFieldId={1}
					></DataTable>
				</div>
			</HeaderContainer>

			{/* Create Modal */}
			<SlideModalContainer isOpen={modalTaskCreate.isOpen} noFade={false}>
				<TaskCreateUpdateModal
					modalTitle={'Create a Task'}
					handleModalDisplay={modalTaskCreate.toggle}
				></TaskCreateUpdateModal>
			</SlideModalContainer>

			{/* Read Modal */}
			<SlideModalContainer isOpen={modalTaskInfo.isOpen} noFade={false}>
				<MyTaskModalHeader
					modalTitle="View Task"
					taskId={modalTaskInfoId}
				>
					<MyTaskReadModal
						taskId={modalTaskInfoId}
						handleModalDisplay={modalTaskInfo.toggle}
					></MyTaskReadModal>
				</MyTaskModalHeader>
			</SlideModalContainer>

			{/* Update Modal */}
			<SlideModalContainer isOpen={modalTaskUpdate.isOpen} noFade={false}>
				<TaskCreateUpdateModal
					modalTitle={'Update a Task'}
					taskId={modalTaskUpdateId}
					handleModalDisplay={modalTaskUpdate.toggle}
				></TaskCreateUpdateModal>
			</SlideModalContainer>
		</>
	);
}
