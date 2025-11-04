import HeaderContainer from '../components/container/header_container';

// Data Table React Component - https://react-data-table-component.netlify.app/
import DataTable from '../components/container/DataTableBase';

import SvgComponent from '../components/ui/svg_component';
import StatusPill from '../components/ui/status_pill';
import SlideModalContainer from '../components/container/modal_containers/slide_modal_container';
import Button from '../components/ui/button';
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../lib/contexts/AuthContext';
import {
	readRepoCollaboratorRequest,
	deleteRepoCollaboratorRequest,
} from '../lib/services/api/github';
import AccessCreationModal from '../components/modals/access/access_creation_model';

export default function MyAccesssPage() {
	// Table react components and stuff
	// states for searchbar to work
	const [filteredItems, setFilteredItems] = useState<any[]>([]);
	const [filterText, setFilterText] = useState('');

	// modal states
	const [showModalCreateAccess, setShowModalCreateAccess] = useState(false);

	// Auth context
	const { token, serverData } = useAuthContext();

	// User's GitHub requests
	const [myRequests, setMyRequests] = useState<any[]>([]);
	const [requestsLoading, setRequestsLoading] = useState(false);
	const [requestsError, setRequestsError] = useState<string | null>(null);

	const columns = [
		{
			name: 'ID',
			selector: (r) => r.id,
			sortable: true,
			width: '50px',
			grow: 0,
		},
		{
			name: 'Repository ID',
			selector: (r) => r.repoId,
			sortable: true,
			width: '120px',
		},
		{
			name: 'Permission',
			selector: (r) => r.permission,
			sortable: true,
			width: '100px',
		},
		{
			name: 'GitHub Username',
			selector: (r) => r.githubUsername,
			sortable: true,
		},
		{
			name: 'Status',
			// Only show 'Pending' for rows that appear to be real requests (have an id).
			// For empty/placeholder rows, show an empty string instead of 'Pending'.
			selector: (r) => (r ? r.status ?? (r.id ? 'Pending' : '') : ''),
			sortable: true,
			width: '80px',
		},
		{
			name: 'Actions',
			// Only render actions (Cancel) for real rows that have an id.
			cell: (row) =>
				row && row.id ? (
					<>
						<button
							className="text-red-600 mr-2"
							onClick={async () => {
								await deleteRepoCollaboratorRequest(
									token!,
									row.id
								);
								await loadMyRequests();
							}}
						>
							Cancel
						</button>
					</>
				) : null,
			width: '100px',
		},
	];

	// Search Bar Filtering
	useEffect(() => {
		const q = (filterText || '').toString().toLowerCase();
		if (!q) {
			setFilteredItems(myRequests || []);
			return;
		}

		const result = (myRequests || []).filter((item: any) => {
			const candidates = [
				item?.id,
				item?.repoId,
				item?.requesting_user,
				item?.requestingUser,
				item?.githubUsername,
				item?.permission,
			];

			return candidates.some((c) =>
				c !== undefined && c !== null
					? c.toString().toLowerCase().includes(q)
					: false
			);
		});
		setFilteredItems(result);
	}, [filterText, myRequests]);

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

	// This is the function that the modal will call to close itself
	function handleModalAccessCreateDisplay() {
		setShowModalCreateAccess(false);
	}

	return (
		<HeaderContainer pageTitle={'Access'}>
			{/* My GitHub Requests */}
			<div className="w-full mt-6">
				<div className="flex justify-between items-center">
					<div>
						{/* Search Bar */}
						<input
							type="text"
							placeholder="Search Requests..."
							value={filterText}
							onChange={(e) => setFilterText(e.target.value)}
							className="border border-gray-300 rounded-md p-2"
						/>
					</div>
					<div className="w-fit">
						{/* Sutton Component */}
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
					<DataTable columns={columns} data={filteredItems} />
				</div>
			</div>

			{/* Modals */}
			{/* Github Request Creation Modal */}
			<SlideModalContainer isOpen={showModalCreateAccess} noFade={false}>
				<AccessCreationModal
					handleModalDisplay={handleModalAccessCreateDisplay}
					onCreated={async () => await loadMyRequests()}
				/>
			</SlideModalContainer>
		</HeaderContainer>
	);
}
