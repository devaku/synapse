import * as _ from 'lodash';
import Button from '../components/ui/button';
import HeaderContainer from '../components/container/header_container';

import SearchBar from '../components/ui/searchbar';
import Table from '../components/container/table';

import { useEffect, useState } from 'react';
import { DeleteTeam, ReadAllTeams } from '../lib/services/team_service';
import SvgComponent from '../components/ui/svg_component';
import SlideModalContainer from '../components/container/modal_containers/slide_modal_container';
import TeamCreateModal from '../components/modals/teams/team_create';
import TeamReadModal from '../components/modals/teams/team_read';
import TeamUpdateModal from '../components/modals/teams/team_update';

// new import for our reusable modal hook
import { useModal } from '../lib/hooks/ui/useModal';

type tableData = {
	columnName: string[];
	rowData: any[];
};

export default function TeamsPage() {
	// [{"id":3,"name":"Last Team","description":"Last team for now"}]

	let mockTeamsResponse = [
		{
			id: 1,
			name: 'First Team',
			description: 'DESCRIPTION',
		},
		{
			id: 2,
			name: 'Second Team',
			description: 'DESCRIPTION',
		},
		{
			id: 3,
			name: 'Third Team',
			description: 'DESCRIPTION',
		},
	];

	/**
	 * MODAL STATES
	 * old way: const [showModalCreateTeam, setShowModalCreateTeam] = useState(false)
	 * new way: using our useModal hook so we don’t repeat code
	 */
	const createTeamModal = useModal();
	const readTeamModal = useModal();
	const updateTeamModal = useModal();

	const [tableData, setTableData] = useState<tableData>({
		columnName: [],
		rowData: [],
	});

	/**
	 * INTERNAL FUNCTIONS
	 */

	useEffect(() => {
		async function start() {
			await refreshTable();
		}
		start();
	}, []);

	useEffect(() => {
		async function start() {
			// refresh table after closing or creating if you want
			// await refreshTable();
		}
		start();
	}, [createTeamModal.isOpen]);

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
	 * Load the teams
	 */

	async function refreshTable() {
		// let data = await ReadAllTeams();
		let data = mockTeamsResponse;
		if (data.length > 0) {
			loadTeams(data);
		} else {
			// Set table to be empty
			setTableData({
				columnName: [],
				rowData: [],
			});
		}
	}

	/**
	 * Primary function that loads the data
	 * received from the API to the table
	 * @param {*} data
	 */
	function loadTeams(data: any) {
		// data
		// [{"id":3,"name":"Last Team","description":"Last team for now"}]

		let extractedValues = groupValuesByKey(data);
		// Extracted values
		// Object { id: (1) […], name: (1) […], description: (1) […] }

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
				rows.push(value[index]);
			}

			// Add the actions at the very end
			let currentData = findTableEntryById(currentId, data);
			let actionData = loadTableActions(currentData);

			rows.push(actionData);

			finalRows.push(rows);
		}

		setTableData({
			columnName: columns,
			rowData: finalRows,
		});
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

		async function handleClickDelete() {
			// TODO: Add modal handling for error here
			try {
				// await DeleteTeam(id);
				// await refreshTable();
			} catch (error) {
				console.log(error);
			}
		}

		return (
			<>
				<button
					className="cursor-pointer w-6 h-6"
					onClick={readTeamModal.toggle} // new hook handles open/close
				>
					<SvgComponent iconName="INFO" className="" />
				</button>
				<button
					className="cursor-pointer w-6 h-6"
					onClick={updateTeamModal.toggle} // same deal here
				>
					<SvgComponent iconName="WRENCH" className="" />
				</button>
				<button
					className="cursor-pointer w-6 h-6"
					onClick={handleClickDelete}
				>
					<SvgComponent iconName="TRASHCAN" className="" />
				</button>
			</>
		);
	}

	/**
	 * Handler functions
	 * old ones (setShowModalX) not needed anymore since useModal gives us .open, .close, .toggle
	 */

	return (
		<>
			<HeaderContainer pageTitle={'Teams'}>
				<div className="flex flex-row justify-between items-center p-2.5">
					<SearchBar />
					<div className="flex flex-row gap-15">
						<Button
							buttonType="add"
							buttonText="Create Team"
							buttonOnClick={createTeamModal.open} // just open directly
						/>
					</div>
				</div>
				<div className="min-h-0 flex flex-col">
					{tableData.columnName.length > 0 ? (
						<Table
							columnName={tableData.columnName}
							rowData={tableData.rowData}
							withActions={true}
						></Table>
					) : (
						<div>Table is empty!</div>
					)}
				</div>
			</HeaderContainer>

			{/* Create Modal */}
			<SlideModalContainer isOpen={createTeamModal.isOpen} noFade={false}>
				<TeamCreateModal
					handleModalDisplay={createTeamModal.toggle}
				></TeamCreateModal>
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
