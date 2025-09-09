import SvgComponent from '../ui/svg_component';
export default function HeaderContainer({
	children,
	pageTitle,
}: {
	children: React.ReactNode;
	pageTitle: string;
}) {
	return (
		<div className="h-full w-full flex flex-col">
			{/* Header */}
			<div className="flex flex-row h-15 bg-gray-100 items-center justify-between">
				{/* Left Side */}
				<div className="text-3xl font-bold text-center text-black px-7.5">
					{pageTitle}
				</div>
				{/* Right Side */}
				<div className="flex flex-row h-10 gap-9.5 px-5 overflow-y-auto">
					<button className="text-black cursor-pointer">
						settings
					</button>
					<button className="text-black cursor-pointer">
						profile
					</button>
					<button className="cursor-pointer">
						<SvgComponent iconName="Profile" />
					</button>
				</div>
			</div>
			{/* Page content */}
			<div className="overflow-y-auto p-10 mb-10 flex-1 min-h-0">
				{children}
			</div>
		</div>
	);
}
