import TTGLogo from '@/assets/images/ttglogo/TTG_Spiral_Logo_White.png';
import TTGIcon from '@/assets/images/ttglogo/TTG_Icon.ico';
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

	const adminPrivileges = true; // TODO: Change this to actual check

	return (
		<div className="h-screen flex flex-col items-center md:w-50 max-md:w-20 bg-ttg-dark-blue px-3 pt-3">
			<img
				src={TTGLogo}
				alt="TTG Logo"
				className="mb-10 max-h-10 max-md:hidden"
			/>
			<img
				src={TTGIcon}
				alt="TTG Icon"
				className="mb-10 max-h-10 10 max-md:visible md:hidden"
			/>
			<div className="flex flex-col justify-between flex-1 overflow-y-auto">
				{/* Tab Buttons */}
				<div className="flex flex-col gap-7.5 md:px-5 max-md:px-0 max-md:items-center max-md:h-10">
					<SidebarButton
						tabName="Home"
						routePath="/home"
						iconPath="Home"
					/>
					<SidebarButton
						tabName="Tasks"
						routePath="/tasks"
						iconPath="Tasks"
					/>
					<SidebarButton
						tabName="Teams"
						routePath="/teams"
						iconPath="Teams"
					/>
					<SidebarButton
						tabName="My Tasks"
						routePath="/my_tasks"
						iconPath="My Tasks"
					/>
					<SidebarButton
						tabName="Charts"
						routePath="/charts"
						iconPath="Charts"
					/>
					<SidebarButton
						tabName="Access"
						routePath="/access"
						iconPath="Access"
					/>

					{/* Admin Privileges for accessing logs and stuff unless not necessary */}
					{adminPrivileges && (
						<SidebarButton
							tabName="Logs"
							routePath="/logs"
							iconPath="Logs"
						/>
					)}
				</div>
			</div>
			{/* Logout Section */}
			<div className="text-center mt-10 w-full">
				<div className="h-[1px] bg-white"></div>
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
