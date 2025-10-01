import * as _ from 'lodash';
import HeaderContainer from '../components/container/header_container';

/**
 * COMPONENTS
 */

import NotificationTableData from '../../testing_jsons/notification_table_testing.json';
import DataTable, { type TableColumn } from 'react-data-table-component';
import SvgComponent from '../components/ui/svg_component';
import StatusPill from '../components/ui/status_pill';

/**
 * MODALS
 */

import SlideModalContainer from '../components/container/modal_containers/slide_modal_container';
import MyTaskReadModal from '../components/modals/my_tasks/my_task_read';
import MyTaskModalHeader from '../components/modals/my_tasks/my_task_header';
import MyTaskDeleteModal from '../components/modals/my_tasks/my_task_delete';
import NotificationModal from '../components/modals/my_tasks/notifications';

/**
 * HOOKS
 */

import { useState, useEffect } from 'react';
import { useModal } from '../lib/hooks/ui/useModal';
import { useAuthContext } from '../lib/contexts/AuthContext';

/**
 * TYPES
 */
import type { Task } from '../lib/types/models';

/**
 * DATA
 */
import schema from '../assets/schemas/schema.json';

/**
 * SERVICES and HELPERS
 */

import { readAllMyTasks } from '../lib/services/api/task';
import { formatDate } from '../lib/helpers/datehelpers';

export default function MyTasksPage() {
	const { token } = useAuthContext();

	// Data Table React Component - https://react-data-table-component.netlify.app/

	/**
	 * There are two states for keeping track of table content
	 * because when it is filtered, it returns a new set of arrays
	 * and we need to remember what the original array was to revert it
	 * back to its original state
	 */
	const [myTaskData, setMyTaskData] = useState<Task[]>([]);
	const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

	const [notificationData, setNotificationData] = useState(
		NotificationTableData || []
	);
	const [filteredNotifications, setFilteredNotifications] =
		useState(notificationData);

	// States used to keep track of the respective
	// texts in the SEARCH BARS
	const [filterTextMyTasks, setFilterTextMyTasks] = useState('');
	const [filterTextNotifications, setFilterTextNotifications] = useState('');

	// Hooks for opening and closing modals
	const modalTaskInfo = useModal();

	// Used to fetch the data that would populate the opened modal
	const [modalTaskInfoId, setModalTaskInfoId] = useState(0);

	const modalTaskDelete = useModal();
	const [modalTaskDeleteId, setmodalTaskDeleteId] = useState(0);

	const modalNotificationinfo = useModal();
	const [modalNotificationInfoId, setmodalNotificationInfoId] = useState(0);

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
						onClick={() => handleMyTaskClickInfo(row)}
					>
						<SvgComponent iconName="INFO" className="" />
					</button>
					<button
						className="cursor-pointer w-6 h-6"
						onClick={() => handleMyTaskClickDelete(row)}
					>
						<SvgComponent iconName="TRASHCAN" className="" />
					</button>
				</div>
			),
		},
	];

	const notificationColumns: TableColumn<any>[] = [
		{
			name: 'ID',
			selector: (row) => row.id,
			sortable: true,
		},
		{
			name: 'Notification',
			selector: (row) => row.name,
			sortable: true,
		},
		{
			name: 'Sent',
			selector: (row) => row.createdAt,
			sortable: true,
		},
		{
			name: 'Status',
			selector: (row) => row.status,
			sortable: true,
			cell: (row) => <StatusPill text={row.status}></StatusPill>,
		},
		{
			name: 'Actions',
			cell: (row) => (
				<>
					<button
						className="cursor-pointer w-6 h-6"
						onClick={() => handleNotificationClickInfo(row)}
					>
						<SvgComponent iconName="INFO" className="" />
					</button>
				</>
			),
		}
	];

	function handleMyTaskClickInfo(row) {
		setModalTaskId(row.id);
		setShowModalTaskInfo(true);
	}

	function handleNotificationClickInfo(row) {
		setModalNotificationId(row.id);
		setShowModalNotification(true);
	}

	function handleClickDelete(row) {
		// If a task
		if (row.name) {
			setModalTaskId(row.id);
			setShowModalTaskDelete(true);
		}
	}

	useEffect(() => {
			const taskResult = myTaskData.filter((item) => {
				return (
					(item.id &&
						item.id
							.toString()
							.toLowerCase()
							.includes(filterTextMyTasks.toLowerCase())) ||
					(item.name &&
						item.name.toLowerCase().includes(filterTextMyTasks.toLowerCase())) ||
					(item.priority &&
						item.priority
							.toLowerCase().includes(filterTextMyTasks.toLowerCase()))
				);
			});
			setFilteredTasks(taskResult);

			const notificationResults = notificationData.filter((item) => {
				return (
					(item.id &&
						item.id
							.toString()
							.toLowerCase()
							.includes(filterTextNotifications.toLowerCase())) ||
					(item.name &&
						item.name
							.toLowerCase()
							.includes(filterTextNotifications.toLowerCase())) ||
					(item.status &&
						item.status
							.toLowerCase()
							.includes(filterTextNotifications.toLowerCase()))
				);
			});
			setFilteredNotifications(notificationResults);
		}, [filterTextNotifications, filterTextMyTasks, myTaskData, notificationData]);



	let mockTaskAPIResponse = [
		{
			id: 1,
			task_name: 'Task 1',
			due_date: new Date().toDateString(),
			status: 'PENDING',
		},
		{
			id: 2,
			task_name: 'Task 2',
			due_date: new Date().toDateString(),
			status: 'OVERDUE',
		},
		{
			id: 3,
			task_name: 'Task 3',
			due_date: new Date().toDateString(),
			status: 'DELIVERED',
		},
	];

	/**
	 * INTERNAL FUNCTIONS
	 */

	// TODO: There should be a listener function here that auto updates the tables
	// for when there are new tasks coming in from the socket

	/**
	 * FETCH TABLE CONTENTS
	 */
	useEffect(() => {
		async function start() {
			await refreshTable();
		}
		start();
	}, []);

	// Refresh tables whenever modals are closed
	useEffect(() => {
		async function start() {
			await refreshTable();
		}
		start();
	}, [
		modalNotificationinfo.isOpen,
		modalTaskDelete.isOpen,
		modalTaskInfo.isOpen,
	]);

	/**
	 * Request the tasks and notifications from the backend
	 */
	async function refreshTable() {
		// TODO: API requests will throw an error if there was a problem
		let subscribedTaskRows = await readAllMyTasks(token!);

		// TODO: Fetch notifications

		setFilteredTasks(subscribedTaskRows);
		setMyTaskData(subscribedTaskRows);
	}

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
						.includes(filterTextMyTasks.toLowerCase())) ||
				(item.name &&
					item.name
						.toLowerCase()
						.includes(filterTextMyTasks.toLowerCase())) ||
				(item.priority &&
					item.priority
						.toLowerCase()
						.includes(filterTextMyTasks.toLowerCase()))
			);
		});
		setFilteredTasks(taskResult);

		const notificationResults = notificationData.filter((item) => {
			return (
				(item.id &&
					item.id
						.toString()
						.toLowerCase()
						.includes(filterTextNotifications.toLowerCase())) ||
				(item.name &&
					item.name
						.toLowerCase()
						.includes(filterTextNotifications.toLowerCase())) ||
				(item.status &&
					item.status
						.toLowerCase()
						.includes(filterTextNotifications.toLowerCase()))
			);
		});
		setFilteredNotifications(notificationResults);
	}, [filterTextNotifications, filterTextMyTasks]);

	/**
	 * HANDLERS
	 */

	function handleMyTaskClickInfo(row: Task) {
		setModalTaskInfoId(row.id);
		modalTaskInfo.open();
	}

	function handleNotificationClickInfo(row: any) {
		modalNotificationinfo.open();
	}

	function handleMyTaskClickDelete(row: Task) {
		setmodalTaskDeleteId(row.id);
		modalTaskDelete.open();
	}

	return (
		<>
			<HeaderContainer pageTitle={'My Tasks'}>
				{/* TABLES */}
				<div className="flex flex-col">
					{/* My Tasks Table */}
					<div>
						{/* Search Bar */}
						<div className="">
							<input
								type="text"
								placeholder="Search My Tasks..."
								className="mb-4 p-2 border rounded border-gray-300 w-50"
								value={filterTextMyTasks}
								onChange={(e) =>
									setFilterTextMyTasks(e.target.value)
								}
							/>
							<button
								className="py-2 px-3 bg-[#153243] text-white border border-[#153243] rounded ml-1"
								onClick={() => {
									setFilterTextMyTasks('');
								}}
							>
								X
							</button>
						</div>
						<div className="h-[400px]">
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

					</div> */}
				</div>
				<div className='flex flex-col'>
					{/* My Tasks Table */}
					<div className="z-0">
						<input
							type="text"
							placeholder="Search My Tasks..."
							className="mb-4 p-2 border rounded border-gray-300 w-50"
							value={filterTextMyTasks}
							onChange={(e) => setFilterTextMyTasks(e.target.value)}
						/>
						<button
							className="py-2 px-3 bg-[#153243] text-white border border-[#153243] rounded ml-1"
							onClick={() => {
								setFilterTextMyTasks('');
							}}
						>
							X
						</button>
					</div>

					{/* My Notifications Table */}
					<div>
						{/* Search Bar */}
						<div className="">
							<input
								type="text"
								placeholder="Search notifications..."
								className="mb-4 p-2 border rounded border-gray-300 w-50"
								value={filterTextNotifications}
								onChange={(e) =>
									setFilterTextNotifications(e.target.value)
								}
							/>
							<button
								className="py-2 px-3 bg-[#153243] text-white border border-[#153243] rounded ml-1"
								onClick={() => {
									setFilterTextNotifications('');
								}}
							>
								X
							</button>
						</div>
						<div className="h-[400px]">
							<DataTable
								columns={notificationColumns}
								data={filteredNotifications}
								fixedHeader={true}
								highlightOnHover={true}
								dense={true}
								pagination
								fixedHeaderScrollHeight="400px"
								className="border border-gray-200"
							/>
						</div>
					</div>
				</div>
			</HeaderContainer>
			{/* TASK MODALS */}
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
			<SlideModalContainer isOpen={modalTaskDelete.isOpen} noFade={false}>
				<MyTaskModalHeader
					modalTitle="Deletion Request"
					taskId={modalTaskDeleteId}
				>
					<MyTaskDeleteModal
						taskId={modalTaskDeleteId}
						handleModalDisplay={modalTaskDelete.toggle}
					></MyTaskDeleteModal>
				</MyTaskModalHeader>
			</SlideModalContainer>

			{/* NOTIFICATION MODALS */}
			<SlideModalContainer
				isOpen={modalNotificationinfo.isOpen}
				noFade={false}
			>
				<NotificationModal
					notificationId={modalNotificationInfoId}
					handleModalDisplay={modalNotificationinfo.open}
				></NotificationModal>
			</SlideModalContainer>
		</>
	);
}
