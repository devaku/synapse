import HeaderContainer from '../../components/container/header_container';

import DataTable from '../../components/container/DataTableBase';
import { useEffect, useState } from 'react';

import NotificationTesting from '../../../testing_jsons/notification_admin_testing.json';
export default function AdminNotificationsManagerPage() {
	const [tableType, setTableType] = useState('teams');
	const [data, setData] = useState(NotificationTesting);
	const [filterText, setFilterText] = useState('');
	const [selectedRows, setSelectedRows] = useState([]);

	const [teamsData, setTeamsData] = useState(data.teams);
	const [tasksData, setTasksData] = useState(data.tasks);
	const [usersData, setUsersData] = useState(data.users);

	const [notificationTitle, setNotificationTitle] = useState('');
	const [notificationContent, setNotificationContent] = useState('');

	// Define columns for each table type
	const teamsColumns = [
		{
			name: 'Team ID',
			selector: (row) => row.id,
			sortable: true,
		},
		{
			name: 'Team Name',
			selector: (row) => row.name,
			sortable: true,
		},
		{
			// This will display the number of members in the team
			// It will require joining tables or access data from Team/User table if there is one
			name: '# of Members',
			selector: (row) => row.members?.length || 0,
		},
		{
			// This will display the number of tasks associated with the team
			// It will require joining tables or access data from Team/Task table if there is one
			name: '# of Tasks',
			selector: (row) => row.tasks?.length || 0,
		},
	];

	const tasksColumns = [
		{
			name: 'Task ID',
			selector: (row) => row.id,
			sortable: true,
		},
		{
			name: 'Task Name',
			selector: (row) => row.name,
			sortable: true,
		},
		{
			name: 'Associated Team',
			selector: (row) => {
				return (
					data.teams.find((team) => team.id === row.associatedTeam)
						?.name || 'N/A'
				);
			},
			sortable: true,
		},
		{
			name: '# of Subscribers',
			selector: (row) => row.subscribers?.length || 0,
		},
	];

	const usersColumns = [
		{
			name: 'User ID',
			selector: (row) => row.id,
			sortable: true,
		},
		{
			name: 'User Name',
			selector: (row) => `${row.lastName}, ${row.firstName}`,
			sortable: true,
		},
		{
			name: '# of Tasks',
			selector: (row) => row.subscribedTasks?.length || 0,
			sortable: true,
		},
	];

	// Handle row selection
	const selectedColumns = [
		{
			name: 'ID',
			selector: (row) => {
				return row.id;
			},
			sortable: true,
		},
		{
			name: 'Type',
			selector: (row) => {
				if ('phone' in row) {
					return 'User';
				}
				if ('members' in row) {
					return 'Team';
				}
				if ('associatedTeam' in row) {
					return 'Task';
				}
				return 'Unknown';
			},
			sortable: true,
		},
		{
			name: 'Name',
			selector: (row) => {
				return row.name || `${row.lastName}, ${row.firstName}`;
			},
			sortable: true,
		},
	];

	const handleRowSelected = ({ selectedRows }) => {
		setSelectedRows(selectedRows);
		if (selectedRows.length > 0) {
			console.log(selectedRows);
		} else {
			console.log('no selected rows');
		}
	};

	useEffect(() => {
		// Filter data based on filterText
		let result = [];
		if (tableType === 'teams') {
			result = data.teams.filter((item) => {
				return (
					(item.id &&
						item.id
							.toString()
							.toLowerCase()
							.includes(filterText.toLowerCase())) ||
					item.name.toLowerCase().includes(filterText.toLowerCase())
				);
			});
			setTeamsData(result);
		} else if (tableType === 'tasks') {
			result = data.tasks.filter((item) => {
				return (
					(item.id &&
						item.id
							.toString()
							.toLowerCase()
							.includes(filterText.toLowerCase())) ||
					item.name
						.toLowerCase()
						.includes(filterText.toLowerCase()) ||
					(item.associatedTeam &&
						data.teams
							.find((team) => team.id === item.associatedTeam)
							?.name.toLowerCase()
							.includes(filterText.toLowerCase()))
				);
			});
			setTasksData(result);
		} else if (tableType === 'users') {
			result = data.users.filter((item) => {
				return (
					item.firstName
						.toLowerCase()
						.includes(filterText.toLowerCase()) ||
					item.lastName
						.toLowerCase()
						.includes(filterText.toLowerCase())
				);
			});
			setUsersData(result);
		}
	}, [filterText, tableType, data]);

	const handleSubmit = (event) => {
		event.preventDefault();

		// Handle form submission logic here
		console.log('Notification Title:', notificationTitle);
		console.log('Notification Content:', notificationContent);
		console.log('Selected Rows:', selectedRows);

		// Reset form fields after submission
		setNotificationTitle('');
		setNotificationContent('');
		setSelectedRows([]);
		setTableType('teams');
		setFilterText('');
		setData(NotificationTesting);
		setTeamsData(NotificationTesting.teams);
		setTasksData(NotificationTesting.tasks);
		setUsersData(NotificationTesting.users);
	};

	return (
		<HeaderContainer pageTitle="Notifications Manager">
			<div>
				{/* Table Component */}
				<div className="flex justify-between items-center">
					<div className="flex flex-row no-wrap">
						<input
							type="text"
							placeholder={'Search ' + tableType + '...'}
							className="mb-4 p-2 border rounded border-gray-300 w-50"
							value={filterText}
							onChange={(e) => setFilterText(e.target.value)}
						/>
						<button
							className="py-2 px-3 bg-[#153243] text-white border h-fit border-[#153243] rounded ml-1"
							onClick={() => {
								setFilterText('');
							}}
						>
							X
						</button>
					</div>
					<div className="flex mb-4 w-fit bg-gray-100 p-2 px-5 rounded items-center justify-between">
						<label className="mr-2 font-medium">Table:</label>
						<select
							title="selecting table type"
							value={tableType}
							onChange={(e) => setTableType(e.target.value)}
							className="p-2 border border-gray-300  bg-white rounded"
						>
							<option value="teams">Teams</option>
							<option value="tasks">Tasks</option>
							<option value="users">Users</option>
						</select>
						<span className="pl-5">
							{selectedRows.length} Selected
						</span>
					</div>
				</div>
				<div className="">
					<DataTable
						className="border border-gray-200"
						data={
							tableType === 'teams'
								? teamsData
								: tableType === 'tasks'
									? tasksData
									: usersData
						}
						columns={
							tableType === 'teams'
								? teamsColumns
								: tableType === 'tasks'
									? tasksColumns
									: usersColumns
						}
						fixedHeaderScrollHeight="400px"
						selectableRows
						onSelectedRowsChange={handleRowSelected}
					/>
				</div>

				{/* Form Content */}
				{/* Probably Turn this into a modal or overlay form later */}
				<form onSubmit={handleSubmit}>
					<div className="mt-5 flex flex-col gap-5 bg-gray-100 p-2 rounded">
						<div className="flex flex-row justify-between bg-white p-2 rounded items-center">
							<span className="text-3xl cursor-pointer">
								Notification Form
							</span>
							<button
								className="py-2 px-3 hover:bg-[#0f4c75] bg-[#153243] text-white border border-[#153243] rounded ml-1"
								type="submit"
							>
								Send Notification
							</button>
						</div>
						{/* Notification Name */}
						<div className="flex flex-row gap-5 items-center flex-wrap">
							<span className="min-w-20 cursor-pointer">
								Name:
							</span>
							<input
								type="text"
								placeholder={'Input Notification Name...'}
								className="p-2 border rounded bg-white border-gray-300 w-50"
								value={notificationTitle}
								onChange={(e) =>
									setNotificationTitle(e.target.value)
								}
								required={true}
							/>
						</div>
						{/* Notification Content */}
						<div className="flex flex-row gap-5 ">
							<span className="min-w-20 cursor-pointer">
								Content:
							</span>
							<textarea
								placeholder={'Input Notification Content...'}
								className="p-2 border bg-white rounded border-gray-300 w-full"
								value={notificationContent}
								onChange={(e) =>
									setNotificationContent(e.target.value)
								}
								required={true}
							/>
						</div>
						{/* Selected Table */}
						<div className="flex flex-row gap-5 items-start">
							<span className="min-w-20 cursor-pointer">
								Selected:
							</span>
							<DataTable
								className="border border-gray-200 cursor-pointer"
								data={selectedRows}
								columns={selectedColumns}
								fixedHeaderScrollHeight="150px"
							/>
						</div>
					</div>
				</form>
			</div>
		</HeaderContainer>
	);
}
