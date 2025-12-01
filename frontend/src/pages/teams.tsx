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
// import DataTable, { type TableColumn } from 'react-data-table-component';
import DataTable from '../components/container/DataTableBase';
import { type TableColumn, type ConditionalStyles } from 'react-data-table-component';

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
			width: '80px',
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
				<div className="flex gap-2">
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
			width: '150px',
		},
	];

	const conditionalRowStyles: ConditionalStyles<Team>[] = [
		{
			when: (row: Team) => row.isDeleted == 1,
			style: { display: 'none' }
		}
	]

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
				<div className="min-h-0 flex flex-col">
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
							data={Array.isArray(teams) ? teams : []}
							conditionalRowStyles={conditionalRowStyles}
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
			<SlideModalContainer isOpen={readTeamModal.isOpen} close={readTeamModal.close} noFade={false}>
				<TeamsViewModal
					teamId={currentTeam?.id || 0}
					handleModalDisplay={readTeamModal.toggle}
				/>
			</SlideModalContainer>
		</>
	);
}
