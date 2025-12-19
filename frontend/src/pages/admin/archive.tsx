import HeaderContainer from '../../components/container/header_container';

import DataTable from '../../components/container/DataTableBase';
import { readAllTasks, deleteTask } from '../../lib/services/api/task';
import StatusPill from '../../components/ui/status_pill';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../lib/contexts/AuthContext';
import type { Task } from '../../lib/types/models';

export default function AdminArchiveManagerPage() {

	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const { keycloak, isAuthenticated, token, userData } = useAuthContext();

	// Check if user is admin and set isAdmin state
	useEffect(() => {
		if (
			userData?.resource_access?.client_synapse.roles.includes('admins')
		) {
			setIsAdmin(true);
		} else {
			setIsAdmin(false);
		}
	}, [userData]);

	useEffect(() => {
		const fetchTasks = async () => {
			let tasks = await readAllTasks(token!);
			let archivedTasks = tasks.filter((task) => task.isArchived == 1)
			setData(archivedTasks)
		}
		fetchTasks()
	}, [])

	const [data, setData] = useState<Task[]>([]);
	const [filteredData, setFilteredData] = useState(data);
	const [filterText, setFilterText] = useState('');

	const [selectedRows, setSelectedRows] = useState([]);
	const [display, setDisplay] = useState('hidden');

	const columns = [
		{
			name: 'ID',
			selector: (row) => row.id,
			sortable: true,
			width: '50px',
		},
		{
			name: 'Name',
			selector: (row) => row.name,
			sortable: true,
		},
		{
			name: 'Created By',
			selector: (row) => row.createdByUserId,
			sortable: true,
		},
		{
			name: 'Archived By',
			selector: (row) => row.archivedByUserId,
			sortable: true,
		},
	];

	const handleRowSelected = ({ selectedRows }) => {
		setSelectedRows(selectedRows);
		if (selectedRows.length > 0) {
			setDisplay('visible');
		} else {
			setDisplay('hidden');
		}
	};

	const deleteSelectedRows = (selectedRows) => {
		const selectedIds = new Set(selectedRows.map((row) => row.id));
		const newData = data.filter((item) => !selectedIds.has(item.id));

		setData(newData);
		setFilteredData(newData);
		setSelectedRows([]);
	};

	const ExpandedComponent = ({ data }) => (
		<pre className="w-full whitespace-pre-wrap break-all overflow-hidden text-xs leading-relaxed bg-gray-50 border border-gray-200 p-3">
			<ul className="">
				<li>ID: {data.id}</li>
				<li>
					Priority: <StatusPill text={data.priority} />
				</li>
				<li>Name: {data.name}</li>
				<li>Description: {data.description}</li>
				<li>
					Image:{' '}
					{data.image ? (
						<img src={data.image} alt={data.name} />
					) : (
						'N/A'
					)}
				</li>
				<li>Start Date: {data.startDate}</li>
				<li>Completed Date: {data.completedDate}</li>
				<li>Created At: {data.createdAt}</li>
				<li>Is Deleted: {data.isDeleted ? 'Yes' : 'No'}</li>
				<li>Created By User ID: {data.createdByUserId}</li>
				<li>Is Archived: {data.isArchived ? 'Yes' : 'No'}</li>
				<li>
					Archived By User ID:{' '}
					{data.archivedByUserId ? data.archivedByUserId : 'N/A'}
				</li>
			</ul>
		</pre>
	);

	useEffect(() => {
		const result = data.filter((item) => {
			return (
				(item.id &&
					item.id
						.toString()
						.toLowerCase()
						.includes(filterText.toLowerCase())) ||
				(item.createdByUserId &&
					item.createdByUserId
						.toString()
						.toLowerCase()
						.includes(filterText.toLowerCase())) ||
				(item.archivedByUserId &&
					item.archivedByUserId
						.toString()
						.toLowerCase()
						.includes(filterText.toLowerCase())) ||
				(item.name &&
					item.name
						.toString()
						.toLowerCase()
						.includes(filterText.toLowerCase()))
			);
		});
		setFilteredData(result);
	}, [filterText, data]);

	return (
		<HeaderContainer pageTitle="Archive Manager">
			{isAdmin ? (
				<div className="w-full h-full">
					<div className="flex justify-between items-center">
						<div className="">
							<input
								type="text"
								placeholder="Search logs..."
								className="mb-4 p-2 border rounded border-gray-300 w-50"
								value={filterText}
								onChange={(e) => setFilterText(e.target.value)}
							/>
							<button
								className="py-2 px-3 bg-[#153243] text-white border border-[#153243] rounded ml-1"
								onClick={() => {
									setFilterText('');
								}}
							>
								X
							</button>
						</div>
						<div
							className={`flex mb-4 w-fit bg-gray-100 p-2 rounded ${display} flex items-center justify-between`}
						>
							<span className="">{selectedRows.length} Selected</span>
							<button
								className="py-2 px-3 ml-3 bg-[#153243] text-white border border-[#153243] rounded ml-1"
								onClick={() => deleteSelectedRows(selectedRows)}
							>
								Delete Permanently
							</button>
						</div>
					</div>
					<DataTable
						columns={columns}
						data={filteredData}
						expandableRows
						expandableRowsComponent={ExpandedComponent}
						expandableRowsHideExpander
						expandOnRowClicked
						className="max-h-full border border-gray-200"
						selectableRows
						onSelectedRowsChange={handleRowSelected}
					/>
				</div>
			) : (
				<div className="w-full h-full">
					<p className="text-2xl font-semibold mb-4">
						You do not have access to view this page.
					</p>
				</div>
			)}

		</HeaderContainer>
	);
}
