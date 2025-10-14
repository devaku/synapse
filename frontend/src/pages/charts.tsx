import HeaderContainer from '../components/container/header_container';
import TabGroup, { TabGroupStyle } from '../components/ui/tab_group';
// import DataTable, { type TableColumn } from 'react-data-table-component';
import DataTable from '../components/container/DataTableBase';
import { type TableColumn } from 'react-data-table-component';
import { Bar, Pie } from 'react-chartjs-2';
import {
	useTeamTasks,
	type LeaderboardTeam,
	type Task,
} from '../lib/hooks/api/useTeamTasks';
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

	const { leaderboardData, tasks } = useTeamTasks();

	type DataRowLeaderboard = LeaderboardTeam & {
		ranking?: number;
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

	const columnsActiveTasks: TableColumn<Task>[] = [
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
	];

	const pieChartData = {
		labels: ['Team 1', 'Team 2'],
		datasets: [
			{
				label: 'Tasks Completed',
				data: [3, 2],
				backgroundColor: ['#7BB863', '#153243'],
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
		labels: ['June', 'July', 'August', 'September', 'October'],
		datasets: [
			{
				label: '# of Tasks',
				data: [12, 19, 3, 4, 5],
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
										data={tasks}
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
										data={leaderboardData}
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
