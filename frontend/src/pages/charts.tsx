import HeaderContainer from '../components/container/header_container';
import ChartCard from '../components/ui/chart_card';
import { Bar, Doughnut } from 'react-chartjs-2';
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
	let barChartOptions = {
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};
	let barChartData = {
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

	let donutChartData = {
		labels: ['Completed', 'In Progress'],
		datasets: [
			{
				label: '# of Votes',
				data: [75, 25],
				backgroundColor: ['#7BB863', '#153243'],
				borderColor: ['#000000'],
				borderWidth: 1,
			},
		],
	};
	return (
		<HeaderContainer pageTitle={'Charts'}>
			<div className="flex w-full justify-evenly gap-1 mb-5">
				<ChartCard
					className=""
					cardText="20"
					cardLabel="Total Tasks"
				></ChartCard>
				<ChartCard
					className=""
					cardText="20"
					cardLabel="Completed Tasks"
				></ChartCard>
				<ChartCard
					className=""
					cardText="20"
					cardLabel="In Progress Tasks"
				></ChartCard>
				<ChartCard
					className=""
					cardText="20"
					cardLabel="Overdue Tasks"
				></ChartCard>
			</div>
			<div className="flex justify-evenly">
				{/* BAR CHART */}
				{/* TODO: This should be a component? */}
				<div className="w-xl  border-2 border-gray-300 rounded-2xl p-4">
					<div className="flex w-full justify-between">
						<p className="text-lg">Task Analytics</p>
						<select name="" id="">
							<option selected value="">
								Monthly
							</option>
							<option selected value="">
								Weekly
							</option>
						</select>
					</div>
					<Bar options={barChartOptions} data={barChartData}></Bar>
				</div>

				{/* DOUGHNUT CHART */}
				<div className="w-xl flex flex-col items-center border-2 border-gray-300 rounded-2xl p-4">
					<div className="w-full text-start">
						<p className="text-lg">Task Progress</p>
					</div>
					<div className="w-full flex justify-evenly">
						<div>
							<p>Completed: 75%</p>
							<p>In Progress: 25%</p>
						</div>
						<div className="w-3xs">
							<Doughnut data={donutChartData}></Doughnut>
						</div>
					</div>
				</div>
			</div>
		</HeaderContainer>
	);
}
