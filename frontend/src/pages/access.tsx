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
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../lib/contexts/AuthContext';
import {
	readRepoCollaboratorRequest,
	createRepoCollaboratorRequest,
	deleteRepoCollaboratorRequest,
} from '../lib/services/api/github';
import AccessCreationModal from '../components/modals/access/access_creation_model';

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
		{ name: 'ID', selector: (r) => r.id, sortable: true },
		{ name: 'Repository ID', selector: (r) => r.repoId, sortable: true },
		{ name: 'Permission', selector: (r) => r.permission, sortable: true },
		{
			name: 'GitHub Username',
			selector: (r) => r.githubUsername,
			sortable: true,
		},
		{
			name: 'Status',
			selector: (r) => r.status ?? 'Pending',
			sortable: true,
		},
		{
			name: 'Actions',
			cell: (row) => (
				<>
					<button
						className="text-red-600 mr-2"
						onClick={async () => {
							await deleteRepoCollaboratorRequest(token!, row.id);
							await loadMyRequests();
						}}
					>
						Cancel
					</button>
				</>
			),
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

	// Auth context
	const { token, serverData } = useAuthContext();

	// User's GitHub requests
	const [myRequests, setMyRequests] = useState<any[]>([]);
	const [requestsLoading, setRequestsLoading] = useState(false);
	const [requestsError, setRequestsError] = useState<string | null>(null);

	// (formState is no longer used; kept for compatibility with other UI parts)

	/**
	 * INTERNAL FUNCTIONS
	 */

	// Load user requests when auth becomes available.
	const loadMyRequests = useCallback(async () => {
		console.log(
			'loadMyRequests: token present?',
			!!token,
			'serverData.id',
			serverData?.id
		);
		if (!token || !serverData?.id) return;
		setRequestsLoading(true);
		setRequestsError(null);
		try {
			const data = await readRepoCollaboratorRequest(token, undefined, {
				userId: serverData.id,
			});
			console.log('readRepoCollaboratorRequest returned:', data);
			const arr = Array.isArray(data) ? data : data ? [data] : [];
			setMyRequests(arr);
		} catch (err: any) {
			console.error('Failed to load user requests', err);
			setRequestsError(err?.message || 'Failed to load requests');
		} finally {
			setRequestsLoading(false);
		}
	}, [token, serverData?.id]);

	useEffect(() => {
		// Trigger load when token and serverData.id become available (e.g., after refresh/login)
		loadMyRequests();
	}, [loadMyRequests]);

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

	// Submit flow is handled by AccessCreationModal directly

	// TODO: There should be a listener function here that auto updates the tables
	// for when there are new Accesss coming in from the socket

	return (
		<HeaderContainer pageTitle={'Access'}>
			{/* My GitHub Requests */}
			<div className="w-full mt-6">
				<div className="flex justify-between items-center">
					<h3 className="text-lg font-semibold">Search Bar Here</h3>
					<div className="w-fit">
						<Button
						type="Success"
						text="Request Access"
						onClick={() => setShowModalCreateAccess(true)}
					/>
					</div>
				</div>
				<div className="mt-3">
					{requestsError && (
						<div className="text-red-600">{requestsError}</div>
					)}
					<DataTable columns={columns} data={myRequests} />
				</div>
			</div>
			<SlideModalContainer isOpen={showModalAccessInfo} noFade={false}>
				<div>
					<button onClick={handleModalAccessInfoDisplay}>
						Close
					</button>
				</div>
			</SlideModalContainer>
			<SlideModalContainer isOpen={showModalCreateAccess} noFade={false}>
				<AccessCreationModal
					handleModalDisplay={handleModalAccessCreateDisplay}
					onCreated={async () => await loadMyRequests()}
				/>
			</SlideModalContainer>
		</HeaderContainer>
	);
}
