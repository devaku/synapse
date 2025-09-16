import * as _ from 'lodash';
import Button from '../components/ui/button';
import HeaderContainer from '../components/container/header_container';

import SearchBar from '../components/ui/searchbar';
import Table from '../components/container/table';

import { useEffect, useState } from 'react';
import SvgComponent from '../components/ui/svg_component';
import SlideModalContainer from '../components/container/modal_containers/slide_modal_container';
import DynamicModal, {
	type FieldMetadata,
} from '../components/modals/generic/dynamic_modal';
import schema from '../assets/schemas/schema.json';

// new import for our reusable modal hook
import { useModal } from '../lib/hooks/ui/useModal';
import StatusPill from '../components/ui/status_pill';

type tableData = {
	columnName: string[];
	rowData: any[];
	status?: string;
};

export default function TasksPage() {
	// [{"id":3,"name":"Last Task","description":"Last Task for now"}]

	let mockTasksResponse = [
		{
			id: 1,
			Name: 'First Task',
			Due_date: 'DESCRIPTION',
			Asigned_by: 'DESCRIPTION',
			Images: 'DESCRIPTION',
			Status: 'PENDING',
		},
		{
			id: 2,
			Name: 'First Task',
			Due_date: 'DESCRIPTION',
			Asigned_by: 'DESCRIPTION',
			Images: 'DESCRIPTION',
			Status: 'PENDING',
		},
		{
			id: 3,
			Name: 'First Task',
			Due_date: 'DESCRIPTION',
			Asigned_by: 'DESCRIPTION',
			Images: 'DESCRIPTION',
			Status: 'PENDING',
		},
	];

	/**
	 * MODAL STATES
	 * old way: const [showModalCreateTask, setShowModalCreateTask] = useState(false)
	 * new way: using our useModal hook so we don’t repeat code
	 */
	const createTaskModal = useModal();
	const readTaskModal = useModal();
	const updateTaskModal = useModal();
	const [formState, setFormState] = useState<Record<string, any>>({});

	// Handle form state updates from the dynamic modal
	const handleFormStateChange = (newState: Record<string, any>) => {
		setFormState(newState);
	};
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
	}, [createTaskModal.isOpen]);

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
	 * Load the Tasks
	 */

	async function refreshTable() {
		// let data = await ReadAllTasks();
		let data = mockTasksResponse;
		if (data.length > 0) {
			loadTasks(data);
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
	function loadTasks(data: any) {
		// data
		// [{"id":3,"name":"Last Task","description":"Last Task for now"}]

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
				// await DeleteTask(id);
				// await refreshTable();
			} catch (error) {
				console.log(error);
			}
		}

		return (
			<>
				<button
					className="cursor-pointer w-6 h-6"
					onClick={readTaskModal.toggle} // new hook handles open/close
				>
					<SvgComponent iconName="INFO" className="" />
				</button>
				<button
					className="cursor-pointer w-6 h-6"
					onClick={updateTaskModal.toggle} // same deal here
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
			<HeaderContainer pageTitle={'Tasks'}>
				<div className="flex flex-row justify-between items-center p-2.5">
					<SearchBar />
					<div className="flex flex-row gap-15">
						<Button
							buttonType="add"
							buttonText="Create Task"
							buttonOnClick={createTaskModal.open} // just open directly
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
			<SlideModalContainer isOpen={createTaskModal.isOpen} noFade={false}>
				<DynamicModal
					metadata={schema['CreateEditTask'] as FieldMetadata[]}
					onStateChange={handleFormStateChange}
				/>
				<button
					className="cursor-pointer w-6 h-6 bg-red-600"
					onClick={createTaskModal.toggle} // new hook handles open/close
				></button>
			</SlideModalContainer>

			{/* Read Modal */}
			<SlideModalContainer isOpen={readTaskModal.isOpen} noFade={false}>
				<DynamicModal
					metadata={schema['CreateEditTask'] as FieldMetadata[]}
					onStateChange={handleFormStateChange}
				/>
				<button
					className="cursor-pointer w-6 h-6 bg-red-600"
					onClick={readTaskModal.toggle} // new hook handles open/close
				></button>
			</SlideModalContainer>

			{/* Update Modal */}
			<SlideModalContainer isOpen={updateTaskModal.isOpen} noFade={false}>
				<DynamicModal
					metadata={schema['CreateEditTask'] as FieldMetadata[]}
					onStateChange={handleFormStateChange}
				/>
				<button
					className="cursor-pointer w-6 h-6 bg-red-600"
					onClick={updateTaskModal.toggle} // new hook handles open/close
				></button>
			</SlideModalContainer>
		</>
	);
}
