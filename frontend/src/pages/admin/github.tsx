import HeaderContainer from '../../components/container/header_container';

import DataTable from '../../components/container/DataTableBase';
import Data from '../../../testing_jsons/generated_data.json';
import { useEffect, useState } from 'react';
import SvgComponent from '../../components/ui/svg_component';

export default function AdminGithubManagerPage() {
	const [data, setData] = useState(Data);
	const [filteredData, setFilteredData] = useState(data);
	const [filterText, setFilterText] = useState('');

	const columns = [
		{
			name: 'ID',
			selector: (row) => row.id,
			sortable: true,
			width: '50px',
		},
		{
			name: 'Team',
			selector: (row) => row.team,
			sortable: true,
		},
		{
			name: 'Created By',
			selector: (row) => row.createdBy,
			sortable: true,
		},
		{
			name: 'Is Accepted',
			selector: (row) => row.isAccepted,
			sortable: true,
			cell: (row) => (row.isAccepted ? 'Yes' : 'No'),
		},
		{
			name: 'Accepted By',
			selector: (row) => row.acceptedBy,
			sortable: true,
			cell: (row) => (row.acceptedBy ? row.acceptedBy : 'N/A'),
		},
		{
			name: 'Actions',
			cell: (row) => (
				<>
					<button
						className="cursor-pointer w-6 h-6"
						onClick={() => handleGitHubClickInfo(row)}
						type="button"
						title={`View details for ${row.name}`}
					>
						<SvgComponent iconName="INFO" className="" />
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

	const ExpandedComponent = ({ data }) => (
		<pre className="w-full whitespace-pre-wrap break-all overflow-hidden text-xs leading-relaxed bg-gray-50 border border-gray-200 p-3">
			<ul className="">
				<li>ID: {data.id}</li>
				<li>Created By: {data.createdBy}</li>
				<li>Team: {data.team}</li>
				<li>Description: {data.description}</li>
				<li>
					GitHub Link: <a href={data.githubLink}>{data.githubLink}</a>
				</li>
				<li>Requested At: {data.requestedAt}</li>
				<li>Is Viewed: {data.isViewed ? 'Yes' : 'No'}</li>
				<li>Is Accepted: {data.isAccepted ? 'Yes' : 'No'}</li>
				<li>
					Accepted By: {data.acceptedBy ? data.acceptedBy : 'N/A'}
				</li>
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
				(item.createdBy &&
					item.createdBy
						.toString()
						.toLowerCase()
						.includes(filterText.toLowerCase())) ||
				(item.acceptedBy &&
					item.acceptedBy
						.toString()
						.toLowerCase()
						.includes(filterText.toLowerCase())) ||
				(item.team &&
					item.team
						.toString()
						.toLowerCase()
						.includes(filterText.toLowerCase()))
			);
		});
		setFilteredData(result);
	}, [filterText, data]);

	return (
		<HeaderContainer pageTitle="GitHub Manager">
			<div className="flex justify-between items-center">
				<div className="">
					<input
						type="text"
						placeholder="Search logs..."
						className="mb-4 p-2 border rounded border-gray-300 w-50"
						value={filterText}
						onChange={(e) => setFilterText(e.target.value)}
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
			</div>
			<DataTable
				columns={columns}
				data={filteredData}
				expandableRows
				expandableRowsComponent={ExpandedComponent}
				expandableRowsHideExpander
				expandOnRowClicked
				className="max-h-full border border-gray-200"
			/>
		</HeaderContainer>
	);
}
