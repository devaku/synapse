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
				<thead className="">
					{columnName.map((item, index) => (
						<th className="px-3 h-10" key={index}>
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
						<th className="flex w-fit px-3 h-10 items-center align-middle">
							Actions
						</th>
					) : (
						''
					)}
				</thead>
				{/* Body Content */}
				<tbody className="text-left">
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
											<td
												className="flex px-3 h-10 items-center align-middle"
												key={cellIndex}
											>
												<div className='"grid grid-flow-col justify-items-center"'>
													{cell}
												</div>
											</td>
										);
									} else if (
										columnName[cellIndex]?.toLowerCase() ===
										'status'
									) {
										return (
											<td
												className="px-3 h-10"
												key={cellIndex}
											>
												<div className="">{cell}</div>
											</td>
										);
									} else {
										return (
											<td
												className="px-3 h-10 w-fit overflow-x-auto text-nowrap"
												key={cellIndex}
											>
												<div className="overflow-x-auto">
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
