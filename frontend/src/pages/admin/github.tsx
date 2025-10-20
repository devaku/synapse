import HeaderContainer from '../../components/container/header_container';

import DataTable from '../../components/container/DataTableBase';
import { useEffect, useState } from 'react';
// import SvgComponent from '../../components/ui/svg_component';
import {
	readRepoCollaboratorRequest,
	addUserToRepo,
	deleteRepoCollaboratorRequest,
} from '../../lib/services/api/github';
import { useAuthContext } from '../../lib/contexts/AuthContext';

export default function AdminGithubManagerPage() {
	const [data, setData] = useState<any[]>([]);
	const [filteredData, setFilteredData] = useState<any[]>(data);
	const [filterText, setFilterText] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { token } = useAuthContext();

	const columns = [
		{
			name: 'ID',
			selector: (row) => row.id,
			sortable: true,
			width: '50px',
		},
		{
			name: 'User ID',
			selector: (row) => row.userId,
			sortable: true,
		},
		{
			name: 'User',
			selector: (row) => row.requesterName,
			sortable: true,
		},
		{
			name: 'Repository ID',
			selector: (row) => row.repoId,
			sortable: true,
		},
		{
			name: 'Permission',
			selector: (row) => row.permission,
			sortable: true,
		},
		{
			name: 'Created At',
			selector: (row) => row.createdAt,
			sortable: true,
		},
		{
			name: 'GitHub Username',
			selector: (row) => row.githubUsername,
			sortable: true,
		},
		{
			name: 'Actions',
			cell: (row) => (
				<>
					{/* implement this later as no time now and with open modal for approve and deny */}
					{/* <button
						className="cursor-pointer w-6 h-6 mr-2"
						onClick={() => handleGitHubClickInfo(row)}
						type="button"
					>
						<SvgComponent iconName="INFO" className="" />
					</button> */}
					<button
						className="cursor-pointer text-green-600 mr-2"
						onClick={() => handleApprove(row)}
						type="button"
						title={`Approve request ${row.id}`}
					>
						A
					</button>
					<button
						className="cursor-pointer text-red-600"
						onClick={() => handleDeny(row)}
						type="button"
						title={`Deny request ${row.id}`}
					>
						D
					</button>
				</>
			),
			width: '80px',
			center: true,
		},
	];

	const handleGitHubClickInfo = (row) => {
		console.log('GitHub Info clicked for row:', row);
	};

	const handleApprove = async (row: any) => {
		setLoading(true);
		setError(null);
		try {
			// call service to add collaborator
			await addUserToRepo(
				token!,
				row.repoId,
				row.githubUsername,
				row.permission || 'pull'
			);
			// delete the request
			await deleteRepoCollaboratorRequest(token!, row.id);
			// refresh list
			const requests = await readRepoCollaboratorRequest(
				token ?? undefined
			);
			const reqArray = Array.isArray(requests)
				? requests
				: requests
					? [requests]
					: [];
			setData(
				reqArray.map((r: any) => ({
					id: r.id,
					userId: r.userId,
					repoId: r.repoId,
					permission: r.permission,
					createdAt: r.createdAt,
					githubUsername: r.githubUsername,
					requesterName:
						r.user?.username ??
						`${r.user?.firstName ?? ''} ${r.user?.lastName ?? ''}`,
				}))
			);
		} catch (err: any) {
			console.error('Approve error', err);
			setError(err?.message || 'Failed to approve request');
		} finally {
			setLoading(false);
		}
	};

	const handleDeny = async (row: any) => {
		setLoading(true);
		setError(null);
		try {
			await deleteRepoCollaboratorRequest(token!, row.id);
			const requests = await readRepoCollaboratorRequest(
				token ?? undefined
			);
			const reqArray = Array.isArray(requests)
				? requests
				: requests
					? [requests]
					: [];
			setData(
				reqArray.map((r: any) => ({
					id: r.id,
					userId: r.userId,
					repoId: r.repoId,
					permission: r.permission,
					createdAt: r.createdAt,
					githubUsername: r.githubUsername,
					requesterName:
						r.user?.username ??
						`${r.user?.firstName ?? ''} ${r.user?.lastName ?? ''}`,
				}))
			);
		} catch (err: any) {
			console.error('Deny error', err);
			setError(err?.message || 'Failed to deny request');
		} finally {
			setLoading(false);
		}
	};

	const ExpandedComponent = ({ data }) => (
		<pre className="w-full whitespace-pre-wrap break-all overflow-hidden text-xs leading-relaxed bg-gray-50 border border-gray-200 p-3">
			<ul className="">
				<li>ID: {data.id}</li>
				<li>User: {data.requesterName}</li>
				<li>Repository ID: {data.repoId}</li>
				<li>Permission: {data.permission}</li>
				<li>Created At: {data.createdAt}</li>
				<li>GitHub Username: {data.githubUsername}</li>
			</ul>
		</pre>
	);

	useEffect(() => {
		const result = data.filter((item) => {
			return (
				(item.id &&
					item.id
						.toString()
						.toLowerCase()
						.includes(filterText.toLowerCase())) ||
				(item.repoId &&
					item.repoId
						.toString()
						.toLowerCase()
						.includes(filterText.toLowerCase())) ||
				(item.permission &&
					item.permission
						.toString()
						.toLowerCase()
						.includes(filterText.toLowerCase())) ||
				(item.createdAt &&
					item.createdAt
						.toString()
						.toLowerCase()
						.includes(filterText.toLowerCase())) ||
				(item.githubUsername &&
					item.githubUsername
						.toString()
						.toLowerCase()
						.includes(filterText.toLowerCase()))
			);
		});
		setFilteredData(result);
	}, [filterText, data]);

	useEffect(() => {
		let mounted = true;
		async function loadRequests() {
			setLoading(true);
			setError(null);
			try {
				const requests = await readRepoCollaboratorRequest(
					token ?? undefined
				);
				if (!mounted) return;
				const reqArray = Array.isArray(requests)
					? requests
					: requests
						? [requests]
						: [];
				const rows = reqArray.map((r: any) => ({
					id: r.id,
					userId: r.userId,
					repoId: r.repoId,
					permission: r.permission,
					createdAt: r.createdAt,
					githubUsername: r.githubUsername,
					requesterName:
						r.user?.username ??
						`${r.user?.firstName ?? ''} ${r.user?.lastName ?? ''}`,
				}));
				setData(rows);
			} catch (err: any) {
				console.error('Error fetching repo requests', err);
				setError(err?.message || 'Failed to load repository requests');
			} finally {
				setLoading(false);
			}
		}

		loadRequests();
		return () => {
			mounted = false;
		};
	}, [token]);

	return (
		<HeaderContainer pageTitle="GitHub Manager">
			{loading && (
				<div className="text-sm text-gray-600 mb-2">
					Loading repositories...
				</div>
			)}
			{error && <div className="text-sm text-red-600 mb-2">{error}</div>}
			<div className="flex justify-between items-center">
				<div className="">
					<input
						type="text"
						placeholder="Search requests..."
						className="mb-4 p-2 border rounded border-gray-300 w-50"
						value={filterText}
						onChange={(e) => setFilterText(e.target.value)}
					/>
				</div>
			</div>
			<DataTable
				columns={columns}
				data={filteredData}
				expandableRows
				expandableRowsComponent={ExpandedComponent}
				expandableRowsHideExpander
				expandOnRowClicked
				dense={true}
				className="max-h-full border border-gray-200"
			/>
		</HeaderContainer>
	);
}
