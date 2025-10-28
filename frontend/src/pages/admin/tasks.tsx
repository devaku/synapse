import HeaderContainer from '../../components/container/header_container';
import Button from '../../components/ui/button';
import DataTable from '../../components/container/DataTableBase';
import { type TableColumn } from 'react-data-table-component';
import type { Task } from '../../lib/types/models';
import { useState } from 'react';
import StatusPill from '../../components/ui/status_pill';
import { formatDate } from '../../lib/helpers/datehelpers';

export default function AdminTaskManagerPage() {
	const [allTaskData, setAllTaskData] = useState<Task[]>([]);
	const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
	const [filterTextTasks, setFilterTextTasks] = useState('');

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
				<p>Admin task management interface</p>
			</div>
		</HeaderContainer>
	);
}