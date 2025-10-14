import * as _ from 'lodash';
import Button from '../components/ui/button';
import HeaderContainer from '../components/container/header_container';

import SearchBar from '../components/ui/searchbar';

import { useEffect, useState, useCallback } from 'react';
import SvgComponent from '../components/ui/svg_component';
import SlideModalContainer from '../components/container/modal_containers/slide_modal_container';
import TeamsCreateUpdateModal from '../components/modals/teams/team_create_update';
import DynamicForm, { type FieldMetadata } from '../components/ui/dynamic_form';
import { useTeams, type Team } from '../lib/hooks/api/useTeams';
// import DataTable, { type TableColumn } from 'react-data-table-component';
import DataTable from '../components/container/DataTableBase';
import { type TableColumn } from 'react-data-table-component';

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
					<button
						className="cursor-pointer w-6 h-6"
						onClick={() => handleEditTeam(row.id)}
						title="Edit Team"
					>
						<SvgComponent iconName="WRENCH" />
					</button>
					<button
						className="cursor-pointer w-6 h-6"
						onClick={() => handleDeleteTeam(row)}
						title="Delete Team"
					>
						<SvgComponent iconName="TRASHCAN" />
					</button>
				</div>
			),
			ignoreRowClick: true,
			allowOverflow: true,
			button: true,
			width: '150px',
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

	const handleEditTeam = (teamId: number) => {
		setCurrentTeam(teams.find((t) => t.id === teamId) || null);
		updateTeamModal.open();
	};

	const handleDeleteTeam = async (team: Team) => {
		if (confirm(`Are you sure you want to delete "${team.name}"?`)) {
			try {
				console.log('Delete team:', team);
				const deletedTeams = await softRemoveTeam([team.id]);
				await refreshTeams();
				createTeamModal.close();
				setFormData({});
			} catch (error) {
				console.error('Error deleting team:', error);
			}
		}
	};

	const tableDataActions = () => {
		return (
			<>
				<Button
					buttonType="add"
					buttonText={`Delete Selected (${selectedRows.length})`}
					buttonOnClick={() => {
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
				<div className="flex flex-row justify-between items-center p-2.5">
					<SearchBar />
					<div className="flex flex-row gap-15">
						<Button
							buttonType="add"
							buttonText="Create Team"
							buttonOnClick={createTeamModal.open}
						/>
					</div>
				</div>
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

			{/* Create Modal */}
			<SlideModalContainer isOpen={createTeamModal.isOpen} noFade={false}>
				<TeamsCreateUpdateModal
					modalTitle="Create Team"
					handleModalDisplay={createTeamModal.toggle}
				/>
			</SlideModalContainer>

			{/* Read Modal */}
			<SlideModalContainer isOpen={readTeamModal.isOpen} noFade={false}>
				<TeamsCreateUpdateModal
					modalTitle="View Team"
					teamId={currentTeam?.id}
					handleModalDisplay={readTeamModal.toggle}
				/>
			</SlideModalContainer>

			{/* Update Modal */}
			<SlideModalContainer isOpen={updateTeamModal.isOpen} noFade={false}>
				<TeamsCreateUpdateModal
					modalTitle="Update Team"
					teamId={currentTeam?.id}
					handleModalDisplay={updateTeamModal.toggle}
				/>
			</SlideModalContainer>
		</>
	);
}
