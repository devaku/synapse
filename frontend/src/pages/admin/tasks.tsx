import HeaderContainer from '../../components/container/header_container';
import Button from '../../components/ui/button';
import DataTable from '../../components/container/DataTableBase';
import { type TableColumn } from 'react-data-table-component';
import type { Task } from '../../lib/types/models';
import { useState, useEffect } from 'react';
import StatusPill from '../../components/ui/status_pill';
import { formatDate } from '../../lib/helpers/datehelpers';
import { useAuthContext } from '../../lib/contexts/AuthContext';
import { readAllTasks, deleteTask } from '../../lib/services/api/task';
import { useSocketContext } from '../../lib/contexts/SocketContext';
import * as SocketEvents from '../../lib/helpers/socket-events';
import { useModal } from '../../lib/hooks/ui/useModal';
import SlideModalContainer from '../../components/container/modal_containers/slide_modal_container';
import MyTaskModalHeader from '../../components/modals/my_tasks/my_task_header';
import MyTaskReadModal from '../../components/modals/my_tasks/my_task_read';
import TaskCreateUpdateModal from '../../components/modals/task/task_create_update';
import SvgComponent from '../../components/ui/svg_component';

export default function AdminTaskManagerPage() {
	const { token, userData } = useAuthContext();
	const { socket } = useSocketContext();

	const [allTaskData, setAllTaskData] = useState<Task[]>([]);
	const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
	const [filterTextTasks, setFilterTextTasks] = useState('');

	// Modal state
	const modalTaskInfo = useModal();
	const [modalTaskInfoId, setModalTaskInfoId] = useState<number | null>(null);

	const modalTaskCreate = useModal();

	const modalTaskUpdate = useModal();
	const [modalTaskUpdateId, setModalTaskUpdateId] = useState<number | null>(null);

	const modalTaskDelete = useModal();
	const [modalTaskDeleteId, setModalTaskDeleteId] = useState<number | null>(null);

	// Check if user has admin role from Keycloak JWT token
	const isAdmin = 
		userData?.resource_access?.client_synapse?.roles?.includes('admins') 
	|| false;

	const taskColumns: TableColumn<Task>[] = [
		{
			name: 'ID',
			selector: (row) => row.id,
			sortable: true,
			width: '80px',
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
						title="View Task"
					>
						<SvgComponent iconName="INFO" className="" />
					</button>
					<button
						className="cursor-pointer w-6 h-6"
						onClick={() => handleTaskClickUpdate(row)}
						title="Edit Task"
					>
						<SvgComponent iconName="WRENCH" className="" />
					</button>
					{isAdmin && (
						<button
							className="cursor-pointer w-6 h-6"
							onClick={() => handleTaskClickDelete(row)}
							title="Delete Task"
						>
							<SvgComponent iconName="TRASHCAN" className="" />
						</button>
					)}
				</div>
			),
			width: '150px',
		},
	];

	// Filtering logic
	useEffect(() => {
		const taskResult = allTaskData.filter((item: Task) => {
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
	}, [filterTextTasks, allTaskData]);

	// API integration
	async function refreshTableHTTP() {
		let allTaskRows = await readAllTasks(token!);
		setFilteredTasks(allTaskRows);
		setAllTaskData(allTaskRows);
	}

	// Initial load
	useEffect(() => {
		async function start() {
			await refreshTableHTTP();
		}
		start();
	}, []);

	// Socket listeners for real-time updates
	useEffect(() => {
		async function start() {
			await refreshTableHTTP();
		}

		socket?.on(SocketEvents.TASK.MAIN_TABLE, start);
		socket?.on(SocketEvents.TASK.TASK_ARCHIVED, start);

		return () => {
			socket?.off(SocketEvents.TASK.MAIN_TABLE, start);
			socket?.off(SocketEvents.TASK.TASK_ARCHIVED, start);
		};
	}, [socket]);

	// Refresh table after modal closes
	useEffect(() => {
		async function start() {
			await refreshTableHTTP();
		}
		start();
	}, [modalTaskCreate.isOpen, modalTaskInfo.isOpen, modalTaskUpdate.isOpen, modalTaskDelete.isOpen]);

	// Handlers
	function handleTaskClickInfo(row: Task) {
		setModalTaskInfoId(row.id);
		modalTaskInfo.open();
	}

	function handleTaskClickUpdate(row: Task) {
		setModalTaskUpdateId(row.id);
		modalTaskUpdate.open();
	}

	function handleTaskClickDelete(row: Task) {
		if (!isAdmin) {
			console.error('Unauthorized: Only admins can delete tasks');
			return;
		}
		setModalTaskDeleteId(row.id);
		modalTaskDelete.open();
	}

	async function handleConfirmDelete() {
		if (modalTaskDeleteId && isAdmin) {
			try {
				await deleteTask(token!, [modalTaskDeleteId]);
				modalTaskDelete.close();
				await refreshTableHTTP();
			} catch (error) {
				console.error('Error deleting task:', error);
				alert('Failed to delete task. You may not have permission.');
			}
		}
	}

	return (
		<>
			<HeaderContainer pageTitle="Admin - Task Manager">
				<div className="flex flex-col">
					<div className="flex flex-row gap-2">
						<input
							type="text"
							placeholder="Search All Tasks (ID, Name, Status)..."
							className="mb-4 p-2 border rounded border-gray-300 w-50"
							value={filterTextTasks}
							onChange={(e) => setFilterTextTasks(e.target.value)}
						/>
						<div className="w-10">
							<Button
								type="Info"
								text="X"
								onClick={() => setFilterTextTasks('')}
							></Button>
						</div>
						<div className="w-fit">
							<Button
								type="Info"
								text="Create Task"
								onClick={() => modalTaskCreate.open()}
							></Button>
						</div>
					</div>
				</div>
				<div className="min-h-0 flex flex-col">
					<DataTable
						title="All Tasks (Admin View)"
						fixedHeader={true}
						dense={true}
						highlightOnHover={true}
						columns={taskColumns}
						data={filteredTasks}
						defaultSortFieldId={1}
						pagination
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
					taskId={modalTaskInfoId!}
				>
					<MyTaskReadModal
						taskId={modalTaskInfoId!}
						handleModalDisplay={modalTaskInfo.toggle}
					></MyTaskReadModal>
				</MyTaskModalHeader>
			</SlideModalContainer>

			{/* Update Modal */}
			<SlideModalContainer isOpen={modalTaskUpdate.isOpen} noFade={false}>
				<TaskCreateUpdateModal
					modalTitle={'Update a Task'}
					taskId={modalTaskUpdateId!}
					handleModalDisplay={modalTaskUpdate.toggle}
				></TaskCreateUpdateModal>
			</SlideModalContainer>

			{/* Delete Confirmation Modal */}
			{isAdmin && (
				<SlideModalContainer isOpen={modalTaskDelete.isOpen} noFade={false}>
					<div className="p-6">
						<h2 className="text-xl font-bold mb-4">Delete Task</h2>
						<p className="mb-6">
							Are you sure you want to delete this task? This action
							cannot be undone.
						</p>
						<div className="flex gap-2 justify-end">
							<Button
								type="Info"
								text="Cancel"
								onClick={modalTaskDelete.close}
							></Button>
							<Button
								type="Danger"
								text="Delete"
								onClick={handleConfirmDelete}
							></Button>
						</div>
					</div>
				</SlideModalContainer>
			)}
		</>
	);
}


// Used AI for lines 36-43 and 175-195
// Prompt: "Add frontend role checking to conditionally show delete button only to users with 'admins' role. Check userData.resource_access.client_synapse.roles from Keycloak JWT token parsed in AuthContext."
