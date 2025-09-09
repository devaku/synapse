/**
 * REACT ROUTER IS USING DATA MODE
 * https://reactrouter.com/start/data/installation
 */

import { createBrowserRouter } from 'react-router';

/**
 * LAYOUTS
 */

import RootLayout from './pages/root_layout';
import DebugLayout from './pages/debug_layout';
import ProtectLayout from './pages/protect_layout';

/**
 * PAGES
 */

import LoginPage from './pages/auth/login';
import DashboardPage from './pages/dashboard';
import SettingsPage from './pages/dashboard/settings';
import ProfilePage from './pages/dashboard/profile';
import ChartsPage from './pages/dashboard/charts';
import LogsPage from './pages/dashboard/logs';
import AccessPage from './pages/dashboard/access';
import TasksPage from './pages/dashboard/tasks';
import TeamsPage from './pages/dashboard/teams';

const protectedRoutes = [
	{
		path: '/dashboard',
		children: [
			{ index: true, Component: DashboardPage },
			{ path: 'settings', Component: SettingsPage },
			{ path: 'tasks', Component: TasksPage },
			{ path: 'teams', Component: TeamsPage },
			{ path: 'profile', Component: ProfilePage },
			// { path: 'my_tasks', Component: MyTasksPage },
			{ path: 'charts', Component: ChartsPage },
			{ path: 'access', Component: AccessPage },
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
						// Component: DebugPage,
					},
				],
			},

			// { path: '/auth/callback/google', Component: GoogleCallbackPage },

			{
				index: true,
				loader: () => {
					// console.log('I"M LOADING');
				},
				Component: LoginPage,
			},

			// { path: '/register', Component: RegisterPage },
			// { path: 'forgot_password', Component: ForgotPasswordPage },
			// { path: 'logged_out', Component: LoggedOutPage },
			/**
			 * PROTECTED ROUTES
			 */
			...protectedRoutes,
		],
	},

	{
		Component: ProtectLayout,
		children: protectedRoutes,
	},

	// WILD CARD
	{
		path: '*',
		element: <div>404 not found</div>,
	},
]);
