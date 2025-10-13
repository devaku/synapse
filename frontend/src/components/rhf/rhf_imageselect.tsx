/**
 * HOOKS
 */
import { useEffect, useState } from 'react';

/**
 * COMPONENTS
 */

export default function RHFImageSelect({
	imageIndex,
	imageUrl,
	fieldValue,
	onChange,
}: {
	imageIndex: number;
	imageUrl: string;
	fieldValue: number[];
	onChange: (ids: any[]) => void;
}) {
	const [isChecked, setIsChecked] = useState<boolean>(false);

	/**
	 * HANDLERS
	 *
	 */

	return (
		<>
			<div className="relative">
				{isChecked ? (
					<div
						className={`absolute rounded-4xl flex items-center justify-center font-extrabold text-red-500 bg-sky-300 w-8 h-8`}
					>
						X
					</div>
				) : (
					''
				)}
				<input
					className="hidden"
					type="checkbox"
					value={imageIndex}
					onChange={(e) => {
						const checked = e.target.checked;
						const value = e.target.value;

						if (checked) {
							onChange([...fieldValue, Number(value)]);
							setIsChecked(true);
						} else {
							onChange(
								fieldValue.filter((v) => v != Number(value))
							);
							setIsChecked(false);
						}
					}}
					id={`img-checkbox-${imageIndex}`}
				/>
				<label htmlFor={`img-checkbox-${imageIndex}`}>
					<img className="w-full h-full" src={imageUrl} alt="" />
				</label>
			</div>
		</>
	);
}
