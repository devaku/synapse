import { useNavigate } from 'react-router';
import SvgComponent from '../ui/svg_component';
export default function HeaderContainer({
	children,
	pageTitle,
}: {
	children: React.ReactNode;
	pageTitle: string;
}) {
	const navigate = useNavigate();

	return (
		<div className="w-full flex flex-col">
			{/* Header */}
			<div className="flex flex-row h-15 bg-gray-100 items-center justify-between">
				{/* Left Side */}
				<div className="text-3xl font-bold text-center text-black px-7.5 cursor-default">
					{pageTitle}
				</div>
				{/* Right Side */}
				<div className="flex flex-row h-10 gap-9.5 px-5 overflow-y-auto">
					<button
						className="text-black cursor-pointer"
						onClick={() => {
							navigate('/dashboard/settings');
						}}
					>
						settings
					</button>
					<div
						className="cursor-pointer flex items-center"
						onClick={() => {
							navigate('/dashboard/profile');
						}}
					>
						<SvgComponent iconName="Profile" />
					</div>
				</div>
			</div>
			{/* Page content */}
			<div className="overflow-y-auto p-10 mb-10 flex-1 min-h-0">
				{children}
			</div>
		</div>
	);
}
