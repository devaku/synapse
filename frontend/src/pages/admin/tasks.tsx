import HeaderContainer from '../../components/container/header_container';
import Button from '../../components/ui/button';
import DataTable from '../../components/container/DataTableBase';
import { type TableColumn } from 'react-data-table-component';
import type { Task } from '../../lib/types/models';
import { useState } from 'react';
import { useEffect } from 'react';
import StatusPill from '../../components/ui/status_pill';
import { formatDate } from '../../lib/helpers/datehelpers';

export default function AdminTaskManagerPage() {
	const [allTaskData, setAllTaskData] = useState<Task[]>([]);
	const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
	const [filterTextTasks, setFilterTextTasks] = useState('');

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
			grow: 2,
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
	];

	return (
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
	);
}