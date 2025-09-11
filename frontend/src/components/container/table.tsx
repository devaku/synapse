/*

Table Component

This reusable React component renders a table UI for displaying tabular data such as Teams, Tasks, MyTasks, or logs. 

Props:
- columnName: Array of strings representing the column headers.
- rowData: Array of arrays, where each inner array represents a row of cell values.

Children:
- Actions are JSX elements passed into it

Features:
- Renders a header row with column names and a sort icon for each column.
- Renders data rows with alternating background colors for better readability.
- Includes an "Action" column with an Info icon for each row (click handler placeholder).
- Uses Tailwind CSS classes for styling and layout.
- Accepts custom SVG icons via the SvgComponent.

Usage:
<Table columnName={["Name", "Role", "Status"]} rowData={[["Alice", "Admin", "Active"], ["Bob", "User", "Inactive"]]} />

*/

import SvgComponent from '../ui/svg_component';

type tableProps = {
	columnName: string[];
	rowData: any[];
	withActions: boolean;
};

export default function Table({
	columnName,
	rowData,
	withActions,
}: tableProps) {
	return (
		<div className="w-full h-full flex flex-col">
			{/* Header */}
			<div className="flex flex-row font-bold gap-3 p-3 bg-white">
				{columnName.map((item, index) => (
					<div className="w-full flex flex-row" key={index}>
						{item}
						<button>
							<SvgComponent
								iconName="Sort"
								className="fill-[#9E9E9E]"
							/>
						</button>
					</div>
				))}

				{withActions ? (
					<div className="flex flex-row justify-between">Actions</div>
				) : (
					''
				)}
			</div>
			{/* Rows of Content */}
			<div className="overflow-y-auto flex-1 min-h-0">
				{rowData.map((row: [], rowIndex: number) => (
					<div
						className="flex flex-row items-center gap-3 p-1"
						style={{
							backgroundColor:
								rowIndex % 2 === 0 ? '#F7F6FE' : 'white',
						}}
						key={rowIndex}
					>
						{row.map((cell, cellIndex) => {
							/**
							 * Change behavior of displaying table
							 * if it has actions at the very end
							 */
							if (withActions) {
								// Actions are placed at the very end
								if (cellIndex == row.length - 1) {
									return (
										<div
											className="flex gap-2"
											key={cellIndex}
										>
											{cell}
										</div>
									);
								} else {
									return (
										<div
											className="flex w-full"
											key={cellIndex}
										>
											{cell}
										</div>
									);
								}
							} else {
								// Normal Table Behavior
								return (
									<div
										className="w-full flex"
										key={cellIndex}
									>
										{cell}
									</div>
								);
							}
						})}
					</div>
				))}
			</div>
		</div>
	);
}
