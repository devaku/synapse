import TTGLogo from '@/assets/images/ttglogo/TTG_Spiral_Logo_White.png';
import TTGIcon from '@/assets/images/ttglogo/TTG_Icon.ico';
import SidebarButton from '../ui/sidebar_button';
import { useNavigate } from 'react-router';
import useAuth from '../../lib/hooks/auth/useAuth';
import { useAuthContext } from '../../lib/contexts/AuthContext';

export default function Sidebar() {
	const navigate = useNavigate();

	const { keycloak, isAuthenticated, token } = useAuthContext();

	// TODO: Change this to actual check
	const adminPrivileges = true;

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
						<div className="mt-10 flex flex-col gap-3 cursor-pointer">
							<h1 className="text-white">Admin Pages</h1>
							<SidebarButton
								tabName="Logs"
								routePath="/logs"
								iconPath=""
							/>
							<SidebarButton
								tabName="Archives"
								routePath="/admin/archive"
								iconPath=""
							/>
							<SidebarButton
								tabName="GitHub"
								routePath="/admin/github"
								iconPath=""
							/>
							<SidebarButton
								tabName="Notific..."
								routePath="/admin/notifications"
								iconPath=""
							/>
							<SidebarButton
								tabName="Teams"
								routePath="/admin/teams"
								iconPath=""
							/>
							<SidebarButton
								tabName="Tasks"
								routePath="/admin/tasks"
								iconPath=""
							/>
						</div>
					)}
				</div>
			</div>
			{/* Logout Section */}
			<div className="text-center mt-10 w-full">
				<div className="h-[1px] bg-white"></div>
				<button
					className="text-white my-10 cursor-pointer"
					onClick={() => {
						keycloak.logout({
							redirectUri: 'http://localhost:3000',
						});
					}}
				>
					Logout
				</button>
			</div>
		</div>
	);
}
