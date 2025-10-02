import * as _ from 'lodash';
import { useEffect, useState } from 'react';

/**
 * COMPONENTS
 */
import Button from '../components/ui/button';

import StatusPill from '../components/ui/status_pill';
import SvgComponent from '../components/ui/svg_component';

import HeaderContainer from '../components/container/header_container';
import SlideModalContainer from '../components/container/modal_containers/slide_modal_container';
import DynamicForm, { type FieldMetadata } from '../components/ui/dynamic_form';
import { useModal } from '../lib/hooks/ui/useModal';

// import DataTable, { type TableColumn } from 'react-data-table-component';
import DataTable from '../components/container/DataTableBase';
// import { type TableColumn } from 'react-data-table-component';

import type { Task } from '../lib/types/models';

/**
 * DATA
 */
import schema from '../assets/schemas/schema.json';

/**
 * SERVICES
 */

import { readAllTasks, deleteTask } from '../lib/services/api/task';
import { color } from 'chart.js/helpers';

// This needs to be put the types.tsx
type tableData = {
	columnName: any[];
	rowData: any[];
};

export default function TasksPage() {
	/**
	 * MODAL RELATED STATES
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

	/**
	 * TABLE RELATED STATES
	 */
	const [toggleClearRows, setTogglClearRows] = useState<boolean>(false);
	const [tableData, setTableData] = useState<tableData>({
		columnName: [],
		rowData: [],
	});
	const [selectedRows, setSelectedRows] = useState<any[]>([]);

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
			await refreshTable();
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

	/**
	 * Convert Date to be readable
	 * Provided by Chatgpt
	 * @param date
	 * @returns
	 */
	function formatCustomDate(isoString: string | undefined): string {
		// If undefined, do nothing
		if (!isoString) {
			return '';
		}

		const date = new Date(isoString);

		// if (isNaN(date.getTime())) {
		// 	throw new Error('Invalid date string');
		// }

		const pad = (n: number): string => n.toString().padStart(2, '0');

		const year = date.getUTCFullYear();
		const month = pad(date.getUTCMonth() + 1); // Months are zero-based
		const day = pad(date.getUTCDate());

		const hours = pad(date.getUTCHours());
		const minutes = pad(date.getUTCMinutes());
		const seconds = pad(date.getUTCSeconds());

		return `${year}-${month}-${day} ${hours}:${minutes}`;
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
		let data = await readAllTasks();
		// console.log(data);
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

	function loadTasks(data: any[]) {
		// Hard coded column names
		const columns = [
			{
				name: 'ID',
				selector: (el: any) => el.id,
				sortable: true,
				width: '75px',
			},
			{
				name: 'Priority',
				selector: (el: any) => el.priority,
				sortable: true,
				cell: (el: any) => <StatusPill text={el.priority}></StatusPill>,
			},
			{
				name: 'Name',
				selector: (el: any) => el.name,
				sortable: true,
			},
			{
				name: 'Description',
				selector: (el: any) => el.description,
				sortable: true,
			},
			{
				name: 'Created By',
				selector: (el: any) => el.createdByUser.username,
				sortable: true,
			},
			{
				name: 'Assigned To',
				selector: (el: any) => el.assignedByUser?.username,
				sortable: true,
			},
			{
				name: 'Created At',
				selector: (el: any) => el.createdAt,
				sortable: true,
				style: {
					width: 'fit-content',
				},
			},
			{
				name: 'Start Date',
				selector: (el: any) => el.startDate,
				sortable: true,
			},
			{
				name: 'Complete Date',
				selector: (el: any) => el.completeDate,
				sortable: true,
			},
			{
				name: 'createdByUserId',
				selector: (el: any) => el.createdByUser.id,
				sortable: true,
				omit: true,
			},
			{
				name: 'assignedByUserId',
				selector: (el: any) => el.assignedByUser.id,
				sortable: true,
				omit: true,
			},
		];

		const rows = data.map((rowData) => {
			rowData.startDate = formatCustomDate(rowData.startDate);
			rowData.completeDate = formatCustomDate(rowData.completeDate);
			rowData.createdAt = formatCustomDate(rowData.createdAt);

			return rowData;
		});

		setTableData({
			columnName: columns,
			rowData: rows,
		});
	}

	/**
	 * Primary function that loads the data
	 * received from the API to the table
	 * @param {*} data
	 */
	function loadTasks2(data: any) {
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
			</>
		);
	}

	function tableDataActions() {
		async function handleClickDelete() {
			// TODO: Add modal handling for error here
			try {
				// Get the ids
				let taskIdArray = selectedRows.map((el) => el.id);

				await deleteTask(taskIdArray);
				await refreshTable();

				// Clear the selected rows on the table
				setTogglClearRows(!toggleClearRows);
			} catch (error) {
				console.log(error);
			}
		}
		return (
			<button
				className="cursor-pointer w-6 h-6"
				onClick={handleClickDelete}
			>
				<SvgComponent iconName="TRASHCAN" className="" />
			</button>
		);
	}

	/**
	 * Handler functions
	 */

	// Handler function for the DataTable
	function handleSelectedRowsChange({ selectedRows }: { selectedRows: any }) {
		setSelectedRows((oldRows) => {
			return [...selectedRows];
		});
	}

	return (
		<>
			<HeaderContainer pageTitle={'Tasks'}>
				<div className="flex flex-row justify-between items-center p-2.5">
					<div className="flex flex-row gap-15">
						<Button
							buttonType="add"
							buttonText="Create Task"
							buttonOnClick={createTaskModal.open} // just open directly
						/>
					</div>
				</div>
				<div className="min-h-0 flex flex-col">
					<DataTable
						title="Available Tasks"
						columns={tableData.columnName}
						data={tableData.rowData}
						selectableRows
						onSelectedRowsChange={handleSelectedRowsChange}
						clearSelectedRows={toggleClearRows}
						contextActions={tableDataActions()}
						defaultSortFieldId={1}
					></DataTable>
				</div>
			</HeaderContainer>

			{/* Create Modal */}
			<SlideModalContainer isOpen={createTaskModal.isOpen} noFade={false}>
				<DynamicForm
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
				<DynamicForm
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
				<DynamicForm
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
