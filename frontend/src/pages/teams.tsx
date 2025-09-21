import * as _ from 'lodash';
import Button from '../components/ui/button';
import HeaderContainer from '../components/container/header_container';

import SearchBar from '../components/ui/searchbar';

import { useEffect, useState } from 'react';
import SvgComponent from '../components/ui/svg_component';
import SlideModalContainer from '../components/container/modal_containers/slide_modal_container';
import TeamCreateModal from '../components/modals/teams/team_create';
import TeamReadModal from '../components/modals/teams/team_read';
import TeamUpdateModal from '../components/modals/teams/team_update';
import DynamicModal, {
	type FieldMetadata,
} from '../components/modals/generic/dynamic_modal';
import { useTeams, type Team } from '../lib/hooks/api/useTeams';
import DataTable, { type TableColumn } from 'react-data-table-component';
import schema from '../assets/schemas/schema.json';

// new import for our reusable modal hook
import { useModal } from '../lib/hooks/ui/useModal';

export default function TeamsPage() {
	// Use the teams API hook
	const { teams, loading, error, refreshTeams, addTeam } = useTeams();
	console.log('Teams from hook: ', teams);
	console.log('Teams type:', typeof teams);
	console.log('Teams is array:', Array.isArray(teams));

	// DataTable state
	const [selectedRows, setSelectedRows] = useState<Team[]>([]);
	const [toggleClearRows, setToggleClearRows] = useState(false);

	// Dynamic modal state
	const [formData, setFormData] = useState<any>({});
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
						onClick={() => handleEditTeam(row)}
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
	const handleFormDataChange = (data: any) => {
		setFormData(data);
	};

	const handleCreateTeam = async () => {
		try {
			// Map form data to the expected format
			const teamData = {
				name: formData.Name || '',
				description: formData.Description || '',
			};

			if (!teamData.name) {
				alert('Team name is required!');
				return;
			}

			const createdTeam = await addTeam(teamData);

			await refreshTeams();

			createTeamModal.close();

			setFormData({});
		} catch (error) {
			console.error('Error creating team:', error);
			alert('Failed to create team. Please try again.');
		}
	};

	const handleViewTeam = (team: Team) => {
		console.log('View team:', team);
		readTeamModal.open();
	};

	const handleEditTeam = (team: Team) => {
		updateTeamModal.open();
	};

	const handleDeleteTeam = async (team: Team) => {
		if (confirm(`Are you sure you want to delete "${team.name}"?`)) {
			try {
				// TODO: Implement removeTeam function in useTeams hook
				console.log('Delete team:', team);
				// await removeTeam(team.id);
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
							contextActions={tableDataActions()}
							defaultSortFieldId={1}
							dense
							pagination
							progressPending={loading}
							progressComponent={<div>Loading teams...</div>}
							noDataComponent={
								<div className="p-8">No teams found!</div>
							}
						/>
					)}
				</div>
			</HeaderContainer>

			{/* Create Modal with Dynamic Form */}
			<SlideModalContainer isOpen={createTeamModal.isOpen} noFade={false}>
				<div className="flex flex-col gap-5 mx-5">
					<div className="mt-5 p-2">
						<p className="text-2xl">Create Team</p>
					</div>

					<DynamicModal
						metadata={teamSchema}
						onStateChange={handleFormDataChange}
					/>

					<div className="flex justify-evenly mb-5">
						<Button
							buttonType="add"
							buttonText="Create Team"
							buttonOnClick={handleCreateTeam}
						/>
						<Button
							buttonType="add"
							buttonText="Close"
							buttonOnClick={() => {
								createTeamModal.close();
								setFormData({});
							}}
						/>
					</div>
				</div>
			</SlideModalContainer>

			{/* Read Modal */}
			<SlideModalContainer isOpen={readTeamModal.isOpen} noFade={false}>
				<TeamReadModal
					handleModalDisplay={readTeamModal.toggle}
				></TeamReadModal>
			</SlideModalContainer>

			{/* Update Modal */}
			<SlideModalContainer isOpen={updateTeamModal.isOpen} noFade={false}>
				<TeamUpdateModal
					handleModalDisplay={updateTeamModal.toggle}
				></TeamUpdateModal>
			</SlideModalContainer>
		</>
	);
}
