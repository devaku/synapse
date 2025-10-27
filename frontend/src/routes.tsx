/**
 * REACT ROUTER IS USING DATA MODE
 * https://reactrouter.com/start/data/installation
 */

import { createBrowserRouter } from 'react-router';

/**
 * CALLBACKS
 */

/**
 * LAYOUTS
 */

import RootLayout from './components/layouts/root_layout';
import DebugLayout from './components/layouts/debug_layout';
import ProtectLayout from './components/layouts/protect_layout';
import DashboardLayout from './components/layouts/dashboard_layout';

/**
 * PAGES
 */

import LoginPage from './pages/auth/login';
import DebugPage from './pages/debug';
import HomePage from './pages/home';
import SettingsPage from './pages/settings';
import ProfilePage from './pages/profile';
import ChartsPage from './pages/charts';
import AccessPage from './pages/access';
import TasksPage from './pages/tasks';
import TeamsPage from './pages/teams';
import MyTasksPage from './pages/my_tasks';
import MCPPage from './pages/mcp';

// ADMIN
import AdminTeamsPage from './pages/admin/teams';
import AdminGithubManagerPage from './pages/admin/github';
import AdminNotificationsManagerPage from './pages/admin/notifications';
import AdminTaskManagerPage from './pages/admin/tasks';
import AdminArchiveManagerPage from './pages/admin/archive';
import LogsPage from './pages/admin/logs';

const protectedRoutes = [
	{
		Component: DashboardLayout,
		children: [
			{ path: 'home', index: true, Component: HomePage },
			{ path: 'settings', Component: SettingsPage },
			{ path: 'tasks', Component: TasksPage },
			{ path: 'teams', Component: TeamsPage },
			{ path: 'profile', Component: ProfilePage },
			{ path: 'my_tasks', Component: MyTasksPage },
			{ path: 'charts', Component: ChartsPage },
			{ path: 'access', Component: AccessPage },
			{ path: 'mcp', Component: MCPPage },

			// ADMIN
			{ path: 'admin/teams', Component: AdminTeamsPage },
			{ path: 'admin/github', Component: AdminGithubManagerPage },
			{
				path: 'admin/notifications',
				Component: AdminNotificationsManagerPage,
			},
			{ path: 'admin/tasks', Component: AdminTaskManagerPage },
			{ path: 'admin/archive', Component: AdminArchiveManagerPage },
			{ path: 'logs', Component: LogsPage },
		],
	},
];

export const router = createBrowserRouter([
	// SITE MAP lol
	{
		path: '/',
		Component: RootLayout,

		children: [
			// DEBUG FOR QUICK UI MOCKUPS
			{
				path: '/debug',
				Component: DebugLayout,
				children: [
					{
						index: true,
						Component: DebugPage,
					},
				],
			},

			{
				index: true,
				loader: () => {
					// console.log('I"M LOADING');
				},
				Component: LoginPage,
			},

			/**
			 * PROTECTED ROUTES
			 */
			{
				Component: ProtectLayout,
				children: protectedRoutes,
			},
		],
	},

	// WILD CARD
	{
		path: '*',
		element: <div>404 not found</div>,
	},
]);
