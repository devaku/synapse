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

export default function MyAccesssPage() {
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
