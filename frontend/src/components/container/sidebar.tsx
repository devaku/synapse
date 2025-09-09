/* eslint-disable prettier/prettier */
import TTGLogo from '@/assets/images/ttglogo/TTG_Spiral_Logo_White.png';
import SidebarButton from '../ui/sidebar_button';
import { useNavigate } from 'react-router';

export default function Sidebar() {
	// const {
	// 	readAuthService,
	// 	ENUM_INTERNAL_COOKIE,
	// 	deleteCookie,
	// 	logoutRemoveCookies,
	// } = useMainAuthContext();
	const navigate = useNavigate();
	// async function handleLogoutClick() {
	// 	// TODO: Could be expanded on the future
	// 	// depending on how someone is logged in.
	// 	let currentAuthService = readAuthService();

	// 	// Clear cookies
	// 	deleteCookie(ENUM_INTERNAL_COOKIE.DJANGO_ACCESS_TOKEN);
	// 	deleteCookie(ENUM_INTERNAL_COOKIE.DJANGO_REFRESH_TOKEN);
	// 	deleteCookie(ENUM_INTERNAL_COOKIE.USER_ID);
	// 	deleteCookie(ENUM_INTERNAL_COOKIE.AUTH_SERVICE);

	// 	// Redirect to Dashboard
	// 	navigate('/');
	// }

	return (
		<div className="h-screen flex flex-col max-w-47.5 ttg-bg-dark-blue px-3 pt-3">
			<img src={TTGLogo} alt="TTG Logo" className="mb-10" />
			<div className="flex flex-col justify-between flex-1 overflow-y-auto">
				{/* Tab Buttons */}
				<div className="flex flex-col gap-7.5 px-5 overflow-">
					<SidebarButton
						tabName="Home"
						routePath="/dashboard"
						iconPath="Home"
					/>
					<SidebarButton
						tabName="Tasks"
						routePath="/dashboard/tasks"
						iconPath="Tasks"
					/>
					<SidebarButton
						tabName="Teams"
						routePath="/dashboard/teams"
						iconPath="Teams"
					/>
					<SidebarButton
						tabName="My Tasks"
						routePath="/dashboard/my_tasks"
						iconPath="My Tasks"
					/>
					<SidebarButton
						tabName="Charts"
						routePath="/dashboard/charts"
						iconPath="Charts"
					/>
					<SidebarButton
						tabName="Access"
						routePath="/dashboard/access"
						iconPath="Access"
					/>
					<SidebarButton
						tabName="Logs"
						routePath="/dashboard/logs"
						iconPath="Logs"
					/>
				</div>
			</div>
			{/* Login Section */}
			<div className="text-center mt-10">
				<div className="h-[1px] bg-white "></div>
				<button
					className="text-white my-10 cursor-pointer"
					onClick={() => {
						navigate('/');
					}}
				>
					Logout
				</button>
			</div>
		</div>
	);
}
