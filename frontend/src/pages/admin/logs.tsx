// Many thanks to React Data Table Component for making this so easy!
// Much of this code was adapted from their examples and documentation.
// https://react-data-table-component.netlify.app/

import HeaderContainer from '../../components/container/header_container';

// import DataTable from 'react-data-table-component';
import DataTable from '../../components/container/DataTableBase';
import SearchBar from '../../components/ui/searchbar';

// import TableData from '../../testing_jsons/log_data_10000.json';
import TableData from '../../../testing_jsons/logs_table_testing_extended_complex.json';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../lib/contexts/AuthContext';

export default function LogsPage() {
	const [selectedRows, setSelectedRows] = useState([]);
	const [data, setData] = useState(TableData.data || []);
	const [display, setDisplay] = useState('hidden');

	const [filterText, setFilterText] = useState('');
	const [filteredItems, setFilteredItems] = useState(data);

	// Admin check for rendering page
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
	// End of admin check

	const handleRowSelected = ({ selectedRows }) => {
		setSelectedRows(selectedRows);
		if (selectedRows.length > 0) {
			setDisplay('visible');
		} else {
			setDisplay('hidden');
		}
	};

	// Directly from Documentation
	// https://react-data-table-component.netlify.app/?path=/docs/examples--exporting-csv
	const convertArrayOfObjectsToCSV = (array) => {
		let result: any;

		const columnDelimiter = ',';
		const lineDelimiter = '\n';
		const keys = Object.keys(data[0]);

		result = '';
		result += keys.join(columnDelimiter);
		result += lineDelimiter;

		array.forEach((item) => {
			let ctr = 0;
			keys.forEach((key) => {
				if (ctr > 0) result += columnDelimiter;

				result += item[key];
				ctr++;
			});
			result += lineDelimiter;
		});

		return result;
	};

	// Directly from Documentation
	// https://react-data-table-component.netlify.app/?path=/docs/examples--exporting-csv
	const downloadCSV = (array) => {
		const link = document.createElement('a');
		let csv = convertArrayOfObjectsToCSV(array);
		if (csv == null) return;

		const filename = 'export.csv';

		if (!csv.match(/^data:text\/csv/i)) {
			csv = `data:text/csv;charset=utf-8,${csv}`;
		}

		link.setAttribute('href', encodeURI(csv));
		link.setAttribute('download', filename);
		link.click();
	};

	const ExpandedComponent = ({ data }) => (
		<pre className="w-full whitespace-pre-wrap break-all overflow-hidden text-xs leading-relaxed bg-gray-50 border border-gray-200 p-3">
			{JSON.stringify(data, null, 2)}
		</pre>
	);

	useEffect(() => {
		const result = data.filter((item) => {
			return (
				(item.logID &&
					item.logID
						.toString()
						.toLowerCase()
						.includes(filterText.toLowerCase())) ||
				(item.user &&
					item.user.toLowerCase().includes(filterText.toLowerCase()))
			);
		});
		setFilteredItems(result);
	}, [filterText, data]);

	const columns = [
		{
			name: 'Log ID',
			selector: (row) => row.logID,
			sortable: true,
			width: '70px',
			grow: 0,
		},
		{
			name: 'User',
			selector: (row) => row.user,
			sortable: true,
			grow: 1,
		},
		{
			name: 'Created At',
			selector: (row) => row.createdAt,
			sortable: true,
			width: '200px',
		},
		// {
		// 	name: "Description",
		// 	selector: row => row.description,
		// 	sortable: true
		// }
	];

	return (
		<HeaderContainer pageTitle={'Logs'}>
			{isAdmin ? (
				<main className="relative">
				<div className="flex justify-between items-center">
					<div className="">
						<SearchBar
							placeholder="Logs..."
							value={filterText}
							onSearch={(text) => setFilterText(text)}
						/>
					</div>
					<div
						className={`flex mb-4 w-fit bg-gray-100 p-2 rounded ${display} flex items-center justify-between`}
					>
						<span className="">{selectedRows.length} Selected</span>
						<button
							className="py-2 px-3 ml-3 bg-[#153243] text-white border border-[#153243] rounded"
							onClick={() => downloadCSV(selectedRows)}
						>
							Download CSV
						</button>
					</div>
				</div>
				<div className="z-0">
					<DataTable
						columns={columns}
						data={filteredItems}
						selectableRows
						onSelectedRowsChange={handleRowSelected}
						// fixedHeader
						// fixedHeaderScrollHeight="70vh"
						expandableRows
						expandableRowsComponent={ExpandedComponent}
						expandableRowsHideExpander
						expandOnRowClicked
						// pointerOnHover
						// highlightOnHover
						// dense
					/>
				</div>
			</main>
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
