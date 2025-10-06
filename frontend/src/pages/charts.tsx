import HeaderContainer from '../components/container/header_container';
import TabGroup, { TabGroupStyle } from '../components/ui/tab_group';
// import DataTable, { type TableColumn } from 'react-data-table-component';
import DataTable from '../components/container/DataTableBase';
import { type TableColumn } from 'react-data-table-component';
import { Bar, Pie } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import StatusPill from '../components/ui/status_pill';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend
);

export default function ChartsPage() {
	const style = getComputedStyle(document.body);

	type DataRowLeaderboard = {
		ranking?: number;
		name: string;
		tasks: number;
	};

	type DataRowActiveTasks = {
		priority: string;
		name: string;
		description: string;
		createdBy: string;
		startDate?: string;
		completeDate?: string;
	};

	const columnsLeaderboard: TableColumn<DataRowLeaderboard>[] = [
		{
			name: 'Ranking',
			selector: (_, i) => {
				if (i === undefined) {
					return 0;
				}
				return i + 1;
			},
			grow: 0.1,
		},
		{
			name: 'Name',
			selector: (row) => row.name,
		},
		{
			name: 'Tasks Completed',
			selector: (row) => row.tasks,
		},
	];

	const columnsActiveTasks: TableColumn<DataRowActiveTasks>[] = [
		{
			name: 'Priority',
			sortable: true,
			cell: (row) => <StatusPill text={row.priority}></StatusPill>,
		},
		{
			name: 'Name',
			selector: (row) => row.name,
			sortable: true,
		},
		{
			name: 'Description',
			selector: (row) => row.description,
			sortable: true,
		},
		{
			name: 'Created By',
			selector: (row) => row.createdBy,
			sortable: true,
		},
		{
			name: 'Start Date',
			selector: (row) => {
				if (row.startDate === undefined) {
					return '';
				}
				return row.startDate;
			},
			sortable: true,
		},
		{
			name: 'Complete Date',
			selector: (row) => {
				if (row.completeDate === undefined) {
					return '';
				}
				return row.completeDate;
			},
			sortable: true,
		},
	];

	const dataLeaderboard = [
		{
			id: 1,
			name: 'Average dude',
			tasks: 10,
		},
		{
			id: 2,
			name: 'Exceptional dude',
			tasks: 99,
		},
		{
			id: 3,
			name: 'Terrible dude',
			tasks: 4,
		},
	];

	const dataActiveTasks = [
		{
			id: 1,
			priority: 'OVERDUE',
			name: 'Build something',
			description: 'Please do this!',
			createdBy: 'Your boss',
		},
		{
			id: 2,
			priority: 'URGENT',
			name: 'Build something else',
			description: 'Please do this!',
			createdBy: 'Your boss again',
		},
		{
			id: 3,
			priority: 'PENDING',
			name: 'Buy supplies',
			description: 'We need them',
			createdBy: 'A coworker',
		},
		{
			id: 4,
			priority: 'PENDING',
			name: 'Do work',
			description: 'You have work to do',
			createdBy: 'Your manager',
		},
	];

	const pieChartData = {
		labels: ['Average dude', 'Exceptional dude', 'Terrible dude'],
		datasets: [
			{
				label: 'Tasks Completed',
				data: [10, 99, 4],
				backgroundColor: ['#7BB863', '#153243', '#436e35'],
				borderColor: [style.getPropertyValue('--ttg-white')],
				borderWidth: 1,
			},
		],
	};

	const barChartOptions = {
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};

	const barChartData = {
		labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
		datasets: [
			{
				label: '# of Tasks',
				data: [12, 19, 3, 5, 2],
				borderWidth: 1,
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
			},
		],
	};

	return (
		<HeaderContainer pageTitle={'Charts'}>
			<TabGroup
				style={TabGroupStyle.Title}
				tabs={[
					{
						name: 'Personal',
						content: (
							<div className="">
								<div className="flex my-10 justify-around gap-5">
									<div className="bg-ttg-black/8 size-fit p-4 rounded-sm flex-1">
										<h3 className="text-xl font-semibold">
											Tasks Completed
										</h3>
										<p className="text-2xl font-bold">10</p>
									</div>
									<div className="bg-ttg-black/8 size-fit p-4 rounded-sm flex-1">
										<h3 className="text-xl font-semibold">
											Active Tasks
										</h3>
										<p className="text-2xl font-bold">4</p>
									</div>
									<div className="bg-ttg-black/8 size-fit p-4 rounded-sm flex-1">
										<h3 className="text-xl font-semibold">
											Urgent Tasks
										</h3>
										<p className="text-2xl font-bold">2</p>
									</div>
									<div className="bg-ttg-black/8 size-fit p-4 rounded-sm flex-1">
										<h3 className="text-xl font-semibold">
											Leaderboard Rank
										</h3>
										<p className="text-2xl font-bold">
											2nd
										</p>
									</div>
								</div>
								<div>
									<DataTable
										title="Active Tasks"
										columns={columnsActiveTasks}
										data={dataActiveTasks}
										defaultSortFieldId={1}
									/>
								</div>
							</div>
						),
					},
					{
						name: 'Global',
						content: (
							<div>
								<div className="my-5">
									<DataTable
										title="Monthly Leaderboard"
										columns={columnsLeaderboard}
										data={dataLeaderboard}
										defaultSortFieldId={3}
										defaultSortAsc={false}
									/>
								</div>
								<div className="flex justify-around mt-10">
									<div className="w-[28%] h-100">
										<h3 className="text-2xl font-semibold text-center">
											Top Ten Breakdown
										</h3>
										<Pie data={pieChartData}></Pie>
									</div>
									<div className="w-[60%] h-100">
										<h3 className="text-2xl font-semibold text-center">
											Past Months Comparison
										</h3>
										<Bar
											options={barChartOptions}
											data={barChartData}
										></Bar>
									</div>
								</div>
							</div>
						),
					},
				]}
			/>
		</HeaderContainer>
	);
}
