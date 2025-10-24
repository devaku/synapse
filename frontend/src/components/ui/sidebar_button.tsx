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

	if (location.pathname == routePath) {
		return (
			<button
				className="flex flex-row items-center gap-2.5 min-h-7.5 text-ttg-green cursor-pointer"
				onClick={() => {
					navigate(routePath);
				}}
			>
				<SvgComponent iconName={iconPath} className="invert" />
				<div className="max-md:hidden">{tabName}</div>
			</button>
		);
	} else {
		return (
			<button
				className="flex flex-row items-center gap-2.5 min-h-7.5 text-white cursor-pointer"
				onClick={() => {
					navigate(routePath);
				}}
			>
				<SvgComponent iconName={iconPath} className="invert" />
				<div className="max-md:hidden">{tabName}</div>
			</button>
		);
	}
}
