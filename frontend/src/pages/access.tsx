import HeaderContainer from '../components/container/header_container';
// import Table from '../components/container/table';
// import SearchBar from '../components/ui/searchbar';

// Data Table React Component - https://react-data-table-component.netlify.app/
import TableData from '../../testing_jsons/access_table_testing.json';
// import DataTable from 'react-data-table-component';
import DataTable from '../components/container/DataTableBase';

import SvgComponent from '../components/ui/svg_component';
import StatusPill from '../components/ui/status_pill';
import SlideModalContainer from '../components/container/modal_containers/slide_modal_container';
import Button from '../components/ui/button';
import * as _ from 'lodash';
import { useState, useEffect } from 'react';
import DynamicForm, { type FieldMetadata } from '../components/ui/dynamic_form';
import schema from '../assets/schemas/schema.json';

// type tableData = {
// 	columnName: string[];
// 	rowData: any[];
// };

export default function MyAccesssPage() {
	// let mockAccessAPIResponse = [
	// 	{
	// 		id: 1,
	// 		repo_name: 'Repo 1',
	// 		requesting_user: 'John',
	// 		access_requested: 'Read',
	// 	},
	// 	{
	// 		id: 2,
	// 		repo_name: 'Repo 2',
	// 		requesting_user: 'Jane',
	// 		access_requested: 'Read',
	// 	},
	// 	{
	// 		id: 3,
	// 		repo_name: 'Repo 3',
	// 		requesting_user: 'Doe',
	// 		access_requested: 'Read/Write',
	// 	},
	// ];

	// Table react components and stuff
	const [data, setData] = useState(TableData.data || []);
	const [filteredItems, setFilteredItems] = useState(data);
	const [filterText, setFilterText] = useState('');

	const columns = [
		{
			name: 'ID',
			selector: (row) => row.id,
			sortable: true,
			grow: 0,
		},
		{
			name: 'Repository Name',
			selector: (row) => row.repo_name,
			sortable: true,
		},
		{
			name: 'Requesting User',
			selector: (row) => row.requesting_user,
			sortable: true,
		},
		{
			name: 'Access Requested',
			selector: (row) => row.access_requested,
			sortable: true,
		},
	];

	useEffect(() => {
		const result = data.filter((item) => {
			return (
				(item.id &&
					item.id
						.toString()
						.toLowerCase()
						.includes(filterText.toLowerCase())) ||
				(item.repo_name &&
					item.repo_name
						.toLowerCase()
						.includes(filterText.toLowerCase())) ||
				(item.requesting_user &&
					item.requesting_user
						.toLowerCase()
						.includes(filterText.toLowerCase()))
			);
		});
		setFilteredItems(result);
	}, [filterText, data]);

	// const [myAccessTableData, setMyAccessTableData] = useState<tableData>({
	// 	columnName: [],
	// 	rowData: [],
	// });

	const [showModalCreateAccess, setShowModalCreateAccess] = useState(false);
	const [showModalAccessInfo, setShowModalAccessInfo] = useState(false);

	const [modalAccessId, setModalAccessId] = useState<number>(0);
	const [formState, setFormState] = useState<Record<string, any>>({});

	// Handle form state updates from the dynamic modal
	const handleFormStateChange = (newState: Record<string, any>) => {
		setFormState(newState);
	};

	/**
	 * INTERNAL FUNCTIONS
	 */

	useEffect(() => {
		async function start() {
			await refreshTable();
		}
		start();
	}, []);

	async function refreshTable() {
		// TODO: Fetch data from the backend
		loadAccessTable(mockAccessAPIResponse);
	}

	/**
	 * Extracts the values given by the API response
	 * Provided by Chatgpt.
	 * @param {*} array
	 * @returns
	 */
	function groupValuesByKey(array: any): Record<string, any[]> {
		return _.transform(
			array[0],
			(result: any, value, key: any) => {
				result[key] = _.map(array, key);
			},
			{}
		);
	}

	function findTableEntryById(id: number, arrayOfObjects: any) {
		// Get the index that the id matches
		// Return that object
		return arrayOfObjects[
			_.findIndex(arrayOfObjects, (element: any) => {
				return element.id == id;
			})
		];
	}

	/**
	 * Primary function that loads the data
	 * received from the API to the table
	 * @param {*} data
	 */
	function loadAccessTable(data: any) {
		let formatted = prepareTableData(data);
		setMyAccessTableData(formatted);
	}

	/**
	 * Parses the incoming API data into
	 * the appropriate column and row data
	 * @param {*} data
	 */
	function prepareTableData(data: any) {
		let extractedValues = groupValuesByKey(data);
		// Object { id: (1) […], name: (1) […], description: (1) […] }

		console.log(extractedValues);

		let columns = [];
		let finalRows = [];

		// Get column names
		for (
			let index = 0;
			index < Object.keys(extractedValues).length;
			index++
		) {
			// Get the column name
			columns.push(Object.keys(extractedValues)[index]);
		}

		// Get row values
		for (
			let index = 0;
			index < extractedValues[columns[0]].length;
			index++
		) {
			let currentId = extractedValues[columns[0]][index];
			let rows = [];
			// Iterate through each key
			for (const [key, value] of Object.entries(extractedValues)) {
				// Status is skipped because it'll be a pill
				if (key == 'status') {
					continue;
				}

				rows.push(value[index]);
			}

			let currentData = findTableEntryById(currentId, data);

			// Add status
			let statusData = loadTableStatusPill(currentData);

			rows.push(statusData);

			// Add the actions at the very end
			let actionData = loadTableActions(currentData);

			rows.push(actionData);

			finalRows.push(rows);
		}

		return {
			columnName: columns,
			rowData: finalRows,
		};
	}

	/**
	 * Create the pills for the statuses
	 * @param {*} dataObject
	 * @returns
	 */
	function loadTableStatusPill(dataObject: any) {
		let { status } = dataObject;
		return <StatusPill text={status}></StatusPill>;
	}

	/**
	 * Loads the JSX elements that will be used
	 * as table actions
	 * @param {*} dataObject
	 * @returns
	 */
	function loadTableActions(dataObject: any) {
		/**
		 * {
		 *  id: 1
		 *  ....
		 * }
		 */

		let { id } = dataObject;

		function handleClickInfo() {
			setModalAccessId(id);
			setShowModalAccessInfo(true);
		}

		// TODO: Change this based on the API
		// If Access

		return (
			<>
				<button
					className="cursor-pointer w-6 h-6"
					onClick={handleClickInfo}
				>
					<SvgComponent iconName="INFO" className="" />
				</button>
			</>
		);
	}

	/**
	 * HANDLERS
	 */

	// This is the function that the modal will call
	// so it can close itself
	function handleModalAccessInfoDisplay() {
		setShowModalAccessInfo(false);
	}
	function handleClickCreateAccess() {
		setShowModalCreateAccess(true);
	}

	function handleModalAccessCreateDisplay() {
		setShowModalCreateAccess(false);
	}

	// TODO: There should be a listener function here that auto updates the tables
	// for when there are new Accesss coming in from the socket

	return (
		<main className="flex flex-row h-screen w-full">
			<HeaderContainer pageTitle={'Access'}>
				{/* TABLES */}
				<div className="flex w-full gap-1">
					{/* Access TABLE */}
					<div className="w-full">
						<div className="flex justify-between items-center">
							<div className="">
								<input
									type="text"
									placeholder="Search logs..."
									className="mb-4 p-2 border rounded border-gray-300 w-50"
									value={filterText}
									onChange={(e) =>
										setFilterText(e.target.value)
									}
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
							<Button
								buttonType="add"
								buttonText="Add Access"
								buttonOnClick={handleClickCreateAccess}
							/>
						</div>
						<div className="">
							<DataTable columns={columns} data={filteredItems} />
						</div>
					</div>
				</div>
			</HeaderContainer>
			{/* Access MODALS */}
			<SlideModalContainer isOpen={showModalAccessInfo} noFade={false}>
				<div>
					{/* <h1>
						{
							findTableEntryById(
								modalAccessId,
								mockAccessAPIResponse
							)?.repo_name
						}
					</h1>
					<p>
						{
							findTableEntryById(
								modalAccessId,
								mockAccessAPIResponse
							)?.access_requested
						}
					</p>
					<p>
						{
							findTableEntryById(
								modalAccessId,
								mockAccessAPIResponse
							)?.requesting_user
						}
					</p> */}
					<button onClick={handleModalAccessInfoDisplay}>
						Close
					</button>
				</div>
			</SlideModalContainer>
			<SlideModalContainer isOpen={showModalCreateAccess} noFade={false}>
				<DynamicForm
					metadata={schema['AccessRequest'] as FieldMetadata[]}
					onStateChange={handleFormStateChange}
				/>
				<button onClick={handleModalAccessCreateDisplay}>Close</button>
			</SlideModalContainer>
		</main>
	);
}
