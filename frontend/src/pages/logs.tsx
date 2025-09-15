import HeaderContainer from '../components/container/header_container';

import Table from '../components/container/table';
import SearchBar from '../components/ui/searchbar';
import SvgComponent from '../components/ui/svg_component';

import { useState, useEffect } from 'react';

type tableData = {
	columnName: string[];
	rowData: any[];
};

export default function LogsPage() {
	const mockLogsAPIResponse = [
		{
			name: '#20462',
			user: 'Matt Dickerson',
			date: '13/06/2022',
			description: 'Transfer Bank',
		},
		{
			name: '#18953',
			user: 'Wiktoria',
			date: '22/05/2022',
			description: 'Cash on Delivery',
		},
		{
			name: '#46169',
			user: 'Trixie Byrd',
			date: '15/06/2022',
			description: 'Cash on Delivery',
		},
		{
			name: '#47188',
			user: 'Sanderson',
			date: '25/09/2022',
			description: 'Transfer Bank',
		},
		{
			name: '#73063',
			user: 'Jon Redfern',
			date: '04/10/2022',
			description: 'Transfer Bank',
		},
		{
			name: '#58825',
			user: 'Miriam Kidd',
			date: '17/10/2022',
			description: 'Transfer Bank',
		},
		{
			name: '#44122',
			user: 'Dominic',
			date: '24/10/2022',
			description: 'Cash on Delivery',
		},
		{
			name: '#89994',
			user: 'Shanice',
			date: '01/11/2022',
			description: 'Transfer Bank',
		},
		{
			name: '#85252',
			user: 'Poppy-Rose',
			date: '22/11/2022',
			description: 'Transfer Bank',
		},
		{
			name: '#96347',
			user: 'Elijah Smith',
			date: '25/11/2022',
			description: 'Cash on Delivery',
		},
	];

	const [logTableData, setLogTableData] = useState<tableData>({
		columnName: [],
		rowData: [],
	});

	useEffect(() => {
		async function start() {
			refreshTable();
		}
		start();
	}, []);

	function refreshTable() {
		loadLogTable(mockLogsAPIResponse);
	}

	function loadLogTable(data: any) {
		const formatted = prepareTableData(data);
		setLogTableData(formatted);
	}

	function prepareTableData(data: any) {
		const columns = ['Name', 'User', 'Date', 'Description'];
		const finalRows: any[] = [];

		data.forEach((log: any) => {
			const row = [
				log.name,
				log.user,
				log.date,
				log.description,
				loadTableActions(log),
			];
			finalRows.push(row);
		});

		return {
			columnName: columns,
			rowData: finalRows,
		};
	}

	function loadTableActions(dataObject: any) {
		function handleClickDelete() {
			// replace with real delete logic when ready
			console.log('Delete log:', dataObject.name);
		}

		return (
			<div className="flex justify-center items-center">
				<button
					className="cursor-pointer w-6 h-6 flex items-center justify-center"
					onClick={handleClickDelete}
				>
					<SvgComponent iconName="TRASHCAN" className="w-4 h-4" />
				</button>
			</div>
		);
	}

	return (
		<>
			<HeaderContainer pageTitle={'Logs'}>
				<div className="w-full">
					<SearchBar />
					<div className="min-h-0 flex flex-col">
						{logTableData.columnName.length > 0 ? (
							<Table
								columnName={logTableData.columnName}
								rowData={logTableData.rowData}
								withActions={true}
							/>
						) : (
							<div>Table is empty!</div>
						)}
					</div>
				</div>
			</HeaderContainer>
		</>
	);
}
