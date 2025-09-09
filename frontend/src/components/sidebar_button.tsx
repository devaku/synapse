import SvgComponent from './svg_component';
import { useNavigate, useLocation } from 'react-router';

type SidebarButtonProps = {
	tabName: string;
	routePath: string;
	iconPath: string;
};

export default function SidebarButton({
	tabName,
	routePath,
	iconPath,
}: SidebarButtonProps) {
	const navigate = useNavigate();
	const location = useLocation();

	// TODO: Add color change when in the current tab
	if (location.pathname == routePath) {
		return (
			<button
				className="flex flex-row items-center gap-2.5 h-7.5 text-white cursor-pointer"
				onClick={() => {
					navigate(routePath);
				}}
			>
				<SvgComponent iconName={iconPath} className="fill-white" />
				{tabName}
			</button>
		);
	} else {
		return (
			<button
				className="flex flex-row items-center gap-2.5 h-7.5 text-white cursor-pointer"
				onClick={() => {
					navigate(routePath);
				}}
			>
				<SvgComponent iconName={iconPath} className="fill-white" />
				{tabName}
			</button>
		);
	}
}
