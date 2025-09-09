import * as _ from 'lodash';
import Button from '../../components/ui/button';
import HeaderContainer from '../../components/container/header_container';

import SearchBar from '../../components/ui/searchbar';
import Sidebar from '../../components/container/sidebar';
import Table from '../../components/container/table';

import { useEffect, useState } from 'react';
import { DeleteTeam, ReadAllTeams } from '../../lib/services/team_service';
import SvgComponent from '../../components/ui/svg_component';
import StatusPill from '../../components/ui/status_pill';
import SlideModalContainer from '../../components/container/modal_containers/slide_modal_container';
import AddTeamModal from '../../components/modals/teams/add_team';

type tableData = {
	columnName: string[];
	rowData: any[];
};

export default function TeamsPage() {
	// let columnName = ['Team', 'Group Count', 'Total Tasks'];
	// let rowData = [
	// 	[
	// 		'Team A',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team B',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team C',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team D',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team E',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team F',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team G',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team H',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team I',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team J',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team K',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team L',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team M',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team N',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team O',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team P',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team Q',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team R',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team S',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team T',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team U',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team V',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team W',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team X',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// 	[
	// 		'Team Y',
	// 		Math.floor(Math.random() * 21),
	// 		Math.floor(Math.random() * 100) + 1,
	// 	],
	// ];

	const [showModalAddTeam, setShowModalAddTeam] = useState(false);
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
			await refreshTable();
		}
		start();
	}, [showModalAddTeam]);

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
		let data = await ReadAllTeams();
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

		function handleClickInfo() {
			console.log('info was clicked!');
		}

		async function handleClickDelete() {
			// TODO: Add modal handling for error here
			try {
				await DeleteTeam(id);
				await refreshTable();
			} catch (error) {
				console.log(error);
			}
		}

		return (
			<>
				<button className="cursor-pointer" onClick={handleClickInfo}>
					<SvgComponent
						iconName="INFO"
						width={16}
						height={16}
						className=""
					/>
				</button>
				<button className="cursor-pointer" onClick={handleClickDelete}>
					<SvgComponent
						iconName="TRASHCAN"
						width={24}
						height={24}
						className=""
					/>
				</button>
			</>
		);
	}

	/**
	 * Handler functions
	 */

	function handleModalDisplayAddTeam() {
		setShowModalAddTeam(!showModalAddTeam);
	}

	function handleClickAddTeam() {
		setShowModalAddTeam(true);
	}

	function handleClickEditTeam() {
		console.log('Edit Team button clicked');
	}

	return (
		<main className="flex flex-row h-screen w-full">
			<Sidebar />
			<HeaderContainer pageTitle={'Teams'}>
				<div className="flex flex-row justify-between items-center p-2.5">
					<SearchBar />
					<div className="flex flex-row gap-15">
						<Button
							buttonType="add"
							buttonText="Add Team"
							buttonOnClick={handleClickAddTeam}
						/>
						<Button
							buttonType="edit"
							buttonText="Edit Team"
							buttonOnClick={handleClickEditTeam}
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
			<SlideModalContainer isOpen={showModalAddTeam} noFade={false}>
				<AddTeamModal
					handleModalDisplay={handleModalDisplayAddTeam}
				></AddTeamModal>
			</SlideModalContainer>
		</main>
	);
}
