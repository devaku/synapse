import HeaderContainer from '../../components/container/header_container';
import Button from '../../components/ui/button';
import DataTable from '../../components/container/DataTableBase';
import { type TableColumn } from 'react-data-table-component';
import type { Task } from '../../lib/types/models';

export default function AdminTaskManagerPage() {
	return (
		<HeaderContainer pageTitle="Admin - Task Manager">
			<div>Admin Task Manager Page</div>
			<div>More to come...</div>
			<div>
				This table should just like, display all the task for everyone
			</div>
			<div>And have the ability to edit/delete/create tasks</div>
			<div>
				Basically everything the normal task page does, but for all
				users
			</div>
			<div>And with more admin controls</div>
		</HeaderContainer>
	);
}
