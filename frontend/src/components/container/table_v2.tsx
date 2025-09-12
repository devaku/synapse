import SvgComponent from '../ui/svg_component';

type tableProps = {
	columnName: string[];
	rowData: any[];
	withActions: boolean;
};

export default function TableV2({
	columnName,
	rowData,
	withActions,
}: tableProps) {
	return (
		<div className="w-full h-full flex flex-col">
			<table>
				{/* Header */}
				<thead>
					{columnName.map((item, index) => (
						<th className="p-1 w-fit" key={index}>
							<div className="flex flex-row items-center align-middle">
								{item}
								<div>
									<SvgComponent
										iconName="Sort"
										className="fill-[#9E9E9E] cursor-pointer"
									/>
								</div>
							</div>
						</th>
					))}

					{withActions ? (
						<th className="flex items-center align-middle">
							Actions
						</th>
					) : (
						''
					)}
				</thead>
				{/* Body Content */}
				<tbody>
					{rowData.map((row: [], rowIndex: number) => (
						<tr
							className=""
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
											<td className="" key={cellIndex}>
												{cell}
											</td>
										);
									} else {
										return (
											<td className="" key={cellIndex}>
												<div className="overflow-x-auto whitespace-nowrap">
													{cell}
												</div>
											</td>
										);
									}
								} else {
									// Normal Table Behavior
									return (
										<td className="" key={cellIndex}>
											{cell}
										</td>
									);
								}
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
