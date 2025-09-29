import * as _ from 'lodash';
import HeaderContainer from '../components/container/header_container';

// Imports for Data Table Component
import MyTaskTableData from '../../testing_jsons/my_task_table_testing.json';
import NotificationTableData from '../../testing_jsons/notification_table_testing.json';
import DataTable from 'react-data-table-component';

import SearchBar from '../components/ui/searchbar';
import SvgComponent from '../components/ui/svg_component';
import StatusPill from '../components/ui/status_pill';

/**
 * MODALS
 */

import SlideModalContainer from '../components/container/modal_containers/slide_modal_container';
import MyTaskReadModal from '../components/modals/my_tasks/my_task_read';
import MyTaskDeleteModal from '../components/modals/my_tasks/my_task_delete';
import NotificationModal from '../components/modals/my_tasks/notifications';

import { useState, useEffect } from 'react';
import TableV2 from '../components/container/table_v2';

type tableData = {
	columnName: string[];
	rowData: any[];
};

export default function MyTasksPage() {

	// Data Table React Component - https://react-data-table-component.netlify.app/
	const [myTaskData, setMyTaskData] = useState(MyTaskTableData.data || []);
	const [notificationData, setNotificationData] = useState(NotificationTableData || []);

	const [filteredTasks, setFilteredTasks] = useState(myTaskData);
	const [filteredNotifications, setFilteredNotifications] = useState(notificationData);

	const [filterTextMyTasks, setFilterTextMyTasks] = useState('');
	const [filterTextNotifications, setFilterTextNotifications] = useState('');

	const taskColumns = [
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
			name: 'Due Date',
			selector: (row) => row.startDate,
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
				<div className='flex gap-2'>
					<button
						className="cursor-pointer w-6 h-6"
						onClick={() => handleMyTaskClickInfo(row)}
					>
						<SvgComponent iconName="INFO" className="" />
					</button>
					<button
						className="cursor-pointer w-6 h-6"
						onClick={() => handleClickDelete(row)}
					>
						<SvgComponent iconName="TRASHCAN" className="" />
					</button>
				</div>
			),
		}
	]

	const notificationColumns = [
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
		}, [filterTextNotifications, filterTextMyTasks]);



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

	let mockNotificationAPIResponse = [
		{
			id: 1,
			notification: 'Notification 1',
			due_date: new Date().toDateString(),
			status: 'UNREAD',
		},
		{
			id: 2,
			notification: 'Notification 2',
			due_date: new Date().toDateString(),
			status: 'UNREAD',
		},
		{
			id: 3,
			notification: 'Notification 3',
			due_date: new Date().toDateString(),
			status: 'READ',
		},
	];

	const [myTaskTableData, setMyTaskTableData] = useState<tableData>({
		columnName: [],
		rowData: [],
	});

	const [notificationTableData, setNotificationTableData] =
		useState<tableData>({
			columnName: [],
			rowData: [],
		});

	const [showModalTaskInfo, setShowModalTaskInfo] = useState<boolean>(false);
	const [showModalTaskDelete, setShowModalTaskDelete] =
		useState<boolean>(false);
	const [modalTaskId, setModalTaskId] = useState<number>(0);

	const [showModalNotification, setShowModalNotification] =
		useState<boolean>(false);
	const [modalNotificationId, setModalNotificationId] = useState<number>(0);

	/**
	 * INTERNAL FUNCTIONS
	 */

	useEffect(() => {
		async function start() {
			await refreshTable();
		}
		start();
	}, []);

	async function refreshTable() {
		// TODO: Fetch data from the backend
		loadTaskTable(mockTaskAPIResponse);
		loadNotificationTable(mockNotificationAPIResponse);
	}

	/**
	 * Extracts the values given by the API response
	 * Provided by Chatgpt.
	 * @param {*} array
	 * @returns
	 */
	function groupValuesByKey(array: any): Record<string, any[]> {
		return _.transform(
			array[0],
			(result: any, value, key: any) => {
				result[key] = _.map(array, key);
			},
			{}
		);
	}

	function findTableEntryById(id: number, arrayOfObjects: any) {
		// Get the index that the id matches
		// Return that object
		return arrayOfObjects[
			_.findIndex(arrayOfObjects, (element: any) => {
				return element.id == id;
			})
		];
	}

	/**
	 * Primary function that loads the data
	 * received from the API to the table
	 * @param {*} data
	 */
	function loadTaskTable(data: any) {
		let formatted = prepareTableData(data);
		setMyTaskTableData(formatted);
	}

	function loadNotificationTable(data: any) {
		let formatted = prepareTableData(data);
		setNotificationTableData(formatted);
	}

	/**
	 * Parses the incoming API data into
	 * the appropriate column and row data
	 * @param {*} data
	 */
	function prepareTableData(data: any) {
		let extractedValues = groupValuesByKey(data);
		// Object { id: (1) […], name: (1) […], description: (1) […] }

		console.log(extractedValues);

		let columns = [];
		let finalRows = [];

		// Get column names
		for (
			let index = 0;
			index < Object.keys(extractedValues).length;
			index++
		) {
			// Get the column name
			columns.push(Object.keys(extractedValues)[index]);
		}

		// Get row values
		for (
			let index = 0;
			index < extractedValues[columns[0]].length;
			index++
		) {
			let currentId = extractedValues[columns[0]][index];
			let rows = [];
			// Iterate through each key
			for (const [key, value] of Object.entries(extractedValues)) {
				// Status is skipped because it'll be a pill
				if (key == 'status') {
					continue;
				}

				rows.push(value[index]);
			}

			let currentData = findTableEntryById(currentId, data);

			// Add status
			let statusData = loadTableStatusPill(currentData);

			rows.push(statusData);

			// Add the actions at the very end
			let actionData = loadTableActions(currentData);

			rows.push(actionData);

			finalRows.push(rows);
		}

		return {
			columnName: columns,
			rowData: finalRows,
		};
	}

	/**
	 * Create the pills for the statuses
	 * @param {*} dataObject
	 * @returns
	 */
	function loadTableStatusPill(dataObject: any) {
		let { status } = dataObject;
		return <StatusPill text={status}></StatusPill>;
	}

	/**
	 * Loads the JSX elements that will be used
	 * as table actions
	 * @param {*} dataObject
	 * @returns
	 */
	function loadTableActions(dataObject: any) {
		/**
		 * {
		 *  id: 1
		 *  ....
		 * }
		 */

		let { id } = dataObject;

		function handleClickInfo() {
			// If a task
			if (dataObject.task_name) {
				setModalTaskId(id);
				setShowModalTaskInfo(true);
			} else {
				// it's a notification
				setModalNotificationId(id);
				setShowModalNotification(true);
			}
		}

		function handleClickDelete() {
			// If a task
			if (dataObject.task_name) {
				setModalTaskId(id);
				setShowModalTaskDelete(true);
			}
		}

		// TODO: Change this based on the API
		// If task
		if (dataObject.task_name) {
			return (
				<>
					<button
						className="cursor-pointer w-6 h-6"
						onClick={handleClickInfo}
					>
						<SvgComponent iconName="INFO" className="" />
					</button>
					<button
						className="cursor-pointer w-6 h-6"
						onClick={handleClickDelete}
					>
						<SvgComponent iconName="TRASHCAN" className="" />
					</button>
				</>
			);
		}
		// Notification
		else {
			return (
				<>
					<button
						className="cursor-pointer w-6 h-6"
						onClick={handleClickInfo}
					>
						<SvgComponent iconName="INFO" className="" />
					</button>
				</>
			);
		}
	}

	/**
	 * HANDLERS
	 */

	// This is the function that the modal will call
	// so it can close itself
	function handleModalTaskInfoDisplay() {
		setShowModalTaskInfo(false);
	}

	function handleModalTaskDeleteDisplay() {
		setShowModalTaskDelete(false);
	}

	function handleModalNotificationDisplay() {
		setShowModalNotification(false);
	}

	// TODO: There should be a listener function here that auto updates the tables
	// for when there are new tasks coming in from the socket

	return (
		<>
			<HeaderContainer pageTitle={'My Tasks'}>
				{/* TABLES */}
				<div className="flex gap-5 max-lg:flex-col">
					{/* TASKS TABLE */}
					{/* <div className="">
						<SearchBar />
						<div className="min-h-0 flex flex-col">
							{myTaskTableData.columnName.length > 0 ? (
								<TableV2
									columnName={myTaskTableData.columnName}
									rowData={myTaskTableData.rowData}
									withActions={true}
								></TableV2>
							) : (
								<div>Table is empty!</div>
							)}
						</div>
					</div> */}

					{/* NOTIFICATION TABLE */}
					{/* <div className="">
						<SearchBar />
						<div className="min-h-0 flex flex-col">
							{myTaskTableData.columnName.length > 0 ? (
								<TableV2
									columnName={
										notificationTableData.columnName
									}
									rowData={notificationTableData.rowData}
									withActions={true}
								></TableV2>
							) : (
								<div>Table is empty!</div>
							)}
						</div>
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
					<DataTable
						columns={taskColumns}
						data={filteredTasks}
						fixedHeader={true}
						highlightOnHover={true}
						dense={true}
						fixedHeaderScrollHeight='400px'
						className='border border-gray-200 mb-10'
					/>
					{/* My Notifications Table */}
					<div className="z-0">
						<input
							type="text"
							placeholder="Search logs..."
							className="mb-4 p-2 border rounded border-gray-300 w-50"
							value={filterTextNotifications}
							onChange={(e) => setFilterTextNotifications(e.target.value)}
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
					<DataTable
						columns={notificationColumns}
						data={filteredNotifications}
						fixedHeader={true}
						highlightOnHover={true}
						dense={true}
						fixedHeaderScrollHeight='400px'
						className='border border-gray-200'
					/>
				</div>
			</HeaderContainer>
			{/* TASK MODALS */}
			<SlideModalContainer isOpen={showModalTaskInfo} noFade={false}>
				<MyTaskReadModal
					taskId={modalTaskId}
					handleModalDisplay={handleModalTaskInfoDisplay}
				></MyTaskReadModal>
			</SlideModalContainer>
			<SlideModalContainer isOpen={showModalTaskDelete} noFade={false}>
				<MyTaskDeleteModal
					taskId={modalTaskId}
					handleModalDisplay={handleModalTaskDeleteDisplay}
				></MyTaskDeleteModal>
			</SlideModalContainer>

			{/* NOTIFICATION MODALS */}
			<SlideModalContainer isOpen={showModalNotification} noFade={false}>
				<NotificationModal
					notificationId={modalNotificationId}
					handleModalDisplay={handleModalNotificationDisplay}
				></NotificationModal>
			</SlideModalContainer>
		</>
	);
}
