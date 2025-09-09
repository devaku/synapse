import SvgComponent from './svg_component';
export default function SearchBar() {
	return (
		<div className="flex flex-row gap-5">
			<div className="text-center bg-white h-7 w-54 border-[#333333]/16 border-1 flex flex-row items-center justify-between px-1">
				<input
					type="text"
					className="active:border-0"
					placeholder="Placeholder"
				/>
				<button onClick={() => {}} className="hover:fill-[#333333]">
					<SvgComponent
						iconName="Search"
						width={16}
						height={16}
						className="fill-[#9E9E9E]"
					/>
				</button>
			</div>
			<SvgComponent
				iconName="Filter"
				width={16}
				height={16}
				className="fill-black mt-2"
			/>
		</div>
	);
}
