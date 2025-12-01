import * as _ from 'lodash';
import Button from '../components/ui/button';
import HeaderContainer from '../components/container/header_container';

import { useEffect, useState, useCallback } from 'react';
import SvgComponent from '../components/ui/svg_component';
import SlideModalContainer from '../components/container/modal_containers/slide_modal_container';
import TeamsCreateUpdateModal from '../components/modals/teams/team_create_update';
import TeamsViewModal from '../components/modals/teams/team_view';
import DynamicForm, { type FieldMetadata } from '../components/ui/dynamic_form';
import { useTeams, type Team } from '../lib/hooks/api/useTeams';
import DataTable from '../components/container/DataTableBase';
import { type TableColumn } from 'react-data-table-component';
import SearchBar from '../components/ui/searchbar';

import schema from '../assets/schemas/schema.json';

// new import for our reusable modal hook
import { useModal } from '../lib/hooks/ui/useModal';

export default function TeamsPage() {
	// Use the teams API hook
	const {
		teams,
		loading,
		error,
		refreshTeams,
		addTeam,
		softRemoveTeam,
		editTeam,
	} = useTeams();

	// DataTable state
	const [selectedRows, setSelectedRows] = useState<Team[]>([]);
	const [toggleClearRows, setToggleClearRows] = useState(false);

	const [filteredTeams, setFilteredTeams] = useState<Team[]>(Array.isArray(teams) ? teams : []);

	// Dynamic modal state
	const [formData, setFormData] = useState<any>({});
	const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
	const teamSchema: FieldMetadata[] =
		schema.CreateEditTeam as FieldMetadata[];

	// Define columns for DataTable
	const columns: TableColumn<Team>[] = [
		{
			name: 'ID',
			selector: (row: Team) => row.id,
			sortable: true,
			width: '60px',
		},
		{
			name: 'Team Name',
			selector: (row: Team) => row.name,
			sortable: true,
			grow: 2,
		},
		{
			name: 'Description',
			selector: (row: Team) => row.description || 'No description',
			sortable: true,
			grow: 3,
		},
		{
			name: 'Actions',
			cell: (row: Team) => (
				<div className="flex gap-2 m-auto">
					<button
						className="cursor-pointer w-6 h-6"
						onClick={() => handleViewTeam(row)}
						title="View Team"
					>
						<SvgComponent iconName="INFO" />
					</button>
				</div>
			),
			ignoreRowClick: true,
			// allowOverflow: true,
			// button: true,
			width: '70px',
		},
	];

	/**
	 * MODAL STATES
	 */
	const createTeamModal = useModal();
	const readTeamModal = useModal();
	const updateTeamModal = useModal();

	/**
	 * DataTable Handler Functions
	 */
	const handleSelectedRowsChange = (state: any) => {
		setSelectedRows(state.selectedRows);
	};

	/**
	 * Dynamic Modal Handlers
	 */
	const handleFormDataChange = useCallback((data: any) => {
		setFormData(data);
	}, []);

	// Simplified handlers using new unified modal
	const handleViewTeam = (team: Team) => {
		setCurrentTeam(team);
		readTeamModal.open();
	};

	// Filtering 
	const [filterTextTeams, setFilterTextTeams] = useState('');

	useEffect(() => {
		if (Array.isArray(teams)) {
			const filtered = teams.filter((team) =>
				team.name.toLowerCase().includes(filterTextTeams.toLowerCase())
			);
			setFilteredTeams(filtered);
		}
	}, [filterTextTeams, teams]);

	const tableDataActions = () => {
		return (
			<>
				<Button
					type="Danger"
					text={`Delete Selected (${selectedRows.length})`}
					onClick={() => {
						if (selectedRows.length > 0) {
							console.log('Delete selected teams:', selectedRows);
						}
					}}
				/>
			</>
		);
	};

	return (
		<>
			<HeaderContainer pageTitle={'Teams'}>
				<div className="min-h-0 flex flex-col pb-1">
					<SearchBar
						placeholder="Search Teams..."
						value={filterTextTeams}
						onSearch={(text) => setFilterTextTeams(text)}
					/>
					{loading ? (
						<div className="flex justify-center items-center p-8">
							<div>Loading teams...</div>
						</div>
					) : error ? (
						<div className="flex justify-center items-center p-8">
							<div className="text-red-500">Error: {error}</div>
						</div>
					) : (
						<DataTable
							title="Teams"
							columns={columns}
							data={filteredTeams}
							selectableRows
							onSelectedRowsChange={handleSelectedRowsChange}
							clearSelectedRows={toggleClearRows}
							//contextActions={tableDataActions()}
							defaultSortFieldId={1}
							progressPending={loading}
							progressComponent={<div>Loading teams...</div>}
							noDataComponent={
								<div className="p-8">No teams found!</div>
							}
						/>
					)}
				</div>
			</HeaderContainer>

			{/* View Modal - Read Only */}
			<SlideModalContainer isOpen={readTeamModal.isOpen} noFade={false}>
				<TeamsViewModal
					teamId={currentTeam?.id || 0}
					handleModalDisplay={readTeamModal.toggle}
				/>
			</SlideModalContainer>
		</>
	);
}
