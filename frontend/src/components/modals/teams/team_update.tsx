import Button from '../../ui/button';
import * as _ from 'lodash';
import { useEffect, useState } from 'react';
import Table from '../../container/table';

type teamUpdateModalProps = {
	handleModalDisplay: () => void;
};

type tableData = {
	columnName: string[];
	rowData: any[];
};

export default function TeamUpdateModal({
	handleModalDisplay,
}: teamUpdateModalProps) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [members, setMembers] = useState<number[]>([]);
	const [tableData, setTableData] = useState<tableData>({
		columnName: [],
		rowData: [],
	});

	let mockApi = [
		{
			id: 1,
			name: 'Member 1',
		},
		{
			id: 2,
			name: 'Member 2',
		},
		{
			id: 3,
			name: 'Member 3',
		},
	];

	useEffect(() => {
		async function start() {
			loadTable(mockApi);
		}
		start();
	}, []);

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
	 * Primary function that loads the data
	 * received from the API to the table
	 * @param {*} data
	 */
	function loadTable(data: any) {
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

		function handleClick(e: React.ChangeEvent<HTMLInputElement>) {
			// If checkbox was checked
			if (e.target.checked) {
				setMembers((oldArray) => [...oldArray, id]);
			} else {
				setMembers((oldArray) => {
					let newArray = oldArray.filter((el) => el !== id);
					return [...newArray];
				});
			}
		}

		return (
			<>
				<input type="checkbox" name="" onChange={handleClick} id="" />
			</>
		);
	}

	/**
	 * Handlers
	 */

	async function handleUpdateTeamClick() {
		// TODO: Add proper displaying in case there's an error
		try {
			// await CreateTeam(name, description);
			handleModalClose();
		} catch (error) {
			console.log(error);
		}
	}

	function handleDescriptionChange(
		e: React.ChangeEvent<HTMLTextAreaElement>
	) {
		setDescription(e.target.value);
	}

	function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		setName(e.target.value);
	}

	function handleModalClose() {
		setName('');
		setDescription('');

		handleModalDisplay();
	}

	return (
		<div className="flex flex-col gap-5 mx-5">
			<div className="mt-5 p-2">
				<p className="text-2xl ">Update Team</p>
			</div>

			<div>
				<p className="mb-2">Team Name:</p>
				<input
					onChange={handleNameChange}
					className="border-2 border-gray-300 p-1"
					type="text"
					name="team_name"
					id=""
					placeholder="Enter Team Name"
				/>
			</div>
			<div>
				<p className="mb-2">Description:</p>
				<textarea
					onChange={handleDescriptionChange}
					className="border-2 border-gray-300 w-full p-1 resize-none"
					name=""
					id=""
					rows={4}
					placeholder="Enter team description..."
				></textarea>
			</div>
			<div>
				<p className="mb-2">Members:</p>
				<Table
					columnName={tableData.columnName}
					rowData={tableData.rowData}
					withActions={true}
				></Table>
			</div>
			<div className="flex justify-evenly">
				<Button
					buttonType="add"
					buttonText="Update Team"
					buttonOnClick={() => handleUpdateTeamClick()}
				/>
				<Button
					buttonType="add"
					buttonText="Close"
					buttonOnClick={() => handleModalClose()}
				/>
			</div>
		</div>
	);
}
