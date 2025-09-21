import HeaderContainer from '../components/container/header_container';
import DataTable from 'react-data-table-component';
import TableData from '../../testing_jsons/logs_table_testing_extended_complex.json';

import React, { useState, useEffect, useMemo } from 'react';
import { differenceBy } from 'lodash';

// type tableData = {
// 	columnName: string[];
// 	rowData: any[];
// };

export default function LogsPage() {

	const [selectedRows, setSelectedRows] = useState([]);
	const [data, setData] = useState(TableData.data || []);
	const [display, setDisplay] = useState("hidden");

	const handleRowSelected = ({ selectedRows }) => {
		setSelectedRows(selectedRows);
		if (selectedRows.length > 0) {
			setDisplay("visible");
		} else {
			setDisplay("hidden");
		}
	}

	const ExpandedComponent = ({ data }) => (
		<pre className="w-full whitespace-pre-wrap break-all overflow-hidden text-xs leading-relaxed bg-gray-50 border border-gray-200 p-3">
			{JSON.stringify(data, null, 2)}
		</pre>
	);

	const columns = [
		{
			name: "Log ID",
			selector: row => row.logID,
			sortable: true,
			maxwidth: '10px',
			grow: 0
		},
		{
			name: "User",
			selector: row => row.user,
			sortable: true,
			grow: 1
		},
		{
			name: "Created At",
			selector: row => row.createdAt,
			sortable: true,
			grow: 1
		},
		// {
		// 	name: "Description",
		// 	selector: row => row.description,
		// 	sortable: true
		// }
	];

	return (
		<HeaderContainer pageTitle={'Logs'}>
			<main className="relative">
				<div className={`flex mb-4 w-full bg-gray-100 p-3 rounded ${display} flex items-center justify-between`}>
					<span className='mr-4 text-3xl'>{selectedRows.length} Selected</span>
					<button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
						Delete Selected
					</button>
				</div>
				<div className="">
					<DataTable 
						columns={columns} 
						data={data} 
						selectableRows
						onSelectedRowsChange={handleRowSelected}
						fixedHeader
						fixedHeaderScrollHeight='70vh'
						expandableRows
						expandableRowsComponent={ExpandedComponent}
						expandableRowsHideExpander
						expandOnRowClicked
						dense
					/>
				</div>
			</main>
		</HeaderContainer>
	);

	// const mockLogsAPIResponse = [
	// 	{
	// 		name: '#20462',
	// 		user: 'Matt Dickerson',
	// 		date: '13/06/2022',
	// 		description: 'Transfer Bank',
	// 	},
	// 	{
	// 		name: '#18953',
	// 		user: 'Wiktoria',
	// 		date: '22/05/2022',
	// 		description: 'Cash on Delivery',
	// 	},
	// 	{
	// 		name: '#46169',
	// 		user: 'Trixie Byrd',
	// 		date: '15/06/2022',
	// 		description: 'Cash on Delivery',
	// 	},
	// 	{
	// 		name: '#47188',
	// 		user: 'Sanderson',
	// 		date: '25/09/2022',
	// 		description: 'Transfer Bank',
	// 	},
	// 	{
	// 		name: '#73063',
	// 		user: 'Jon Redfern',
	// 		date: '04/10/2022',
	// 		description: 'Transfer Bank',
	// 	},
	// 	{
	// 		name: '#58825',
	// 		user: 'Miriam Kidd',
	// 		date: '17/10/2022',
	// 		description: 'Transfer Bank',
	// 	},
	// 	{
	// 		name: '#44122',
	// 		user: 'Dominic',
	// 		date: '24/10/2022',
	// 		description: 'Cash on Delivery',
	// 	},
	// 	{
	// 		name: '#89994',
	// 		user: 'Shanice',
	// 		date: '01/11/2022',
	// 		description: 'Transfer Bank',
	// 	},
	// 	{
	// 		name: '#85252',
	// 		user: 'Poppy-Rose',
	// 		date: '22/11/2022',
	// 		description: 'Transfer Bank',
	// 	},
	// 	{
	// 		name: '#96347',
	// 		user: 'Elijah Smith',
	// 		date: '25/11/2022',
	// 		description: 'Cash on Delivery',
	// 	},
	// ];

	// const [logTableData, setLogTableData] = useState<tableData>({
	// 	columnName: [],
	// 	rowData: [],
	// });

	// useEffect(() => {
	// 	async function start() {
	// 		refreshTable();
	// 	}
	// 	start();
	// }, []);

	// function refreshTable() {
	// 	loadLogTable(mockLogsAPIResponse);
	// }

	// function loadLogTable(data: any) {
	// 	const formatted = prepareTableData(data);
	// 	setLogTableData(formatted);
	// }

	// function prepareTableData(data: any) {
	// 	const columns = ['Name', 'User', 'Date', 'Description'];
	// 	const finalRows: any[] = [];

	// 	data.forEach((log: any) => {
	// 		const row = [
	// 			log.name,
	// 			log.user,
	// 			log.date,
	// 			log.description,
	// 			loadTableActions(log),
	// 		];
	// 		finalRows.push(row);
	// 	});

	// 	return {
	// 		columnName: columns,
	// 		rowData: finalRows,
	// 	};
	// }

	// function loadTableActions(dataObject: any) {
	// 	function handleClickDelete() {
	// 		// replace with real delete logic when ready
	// 		console.log('Delete log:', dataObject.name);
	// 	}

	// 	return (
	// 		<div className="flex justify-center items-center">
	// 			<button
	// 				className="cursor-pointer w-6 h-6 flex items-center justify-center"
	// 				onClick={handleClickDelete}
	// 			>
	// 				<SvgComponent iconName="TRASHCAN" className="w-4 h-4" />
	// 			</button>
	// 		</div>
	// 	);
	// }

	// return (
	// 	<>
	// 		<HeaderContainer pageTitle={'Logs'}>
	// 			<div className="w-full">
	// 				<SearchBar />
	// 				<div className="min-h-0 flex flex-col">
	// 					{logTableData.columnName.length > 0 ? (
	// 						<Table
	// 							columnName={logTableData.columnName}
	// 							rowData={logTableData.rowData}
	// 							withActions={true}
	// 						/>
	// 					) : (
	// 						<div>Table is empty!</div>
	// 					)}
	// 				</div>
	// 			</div>
	// 		</HeaderContainer>
	// 	</>
	// );
}
