/**
 * REACT ROUTER IS USING DATA MODE
 * https://reactrouter.com/start/data/installation
 */

import { createBrowserRouter } from 'react-router';

/**
 * CALLBACKS
 */

import LoginCallback from './pages/auth/callback/login_callback';

/**
 * LAYOUTS
 */

import RootLayout from './pages/root_layout';
import DebugLayout from './pages/debug_layout';
import ProtectLayout from './pages/protect_layout';
import DashboardLayout from './pages/dashboard_layout';

/**
 * PAGES
 */

import RegisterPage from './pages/auth/register';
import ForgotPasswordPage from './pages/auth/forgot_password';
import LoggedOutPage from './pages/auth/logged_out';

import LoginPage from './pages/auth/login';
import DebugPage from './pages/debug';
import HomePage from './pages/home';
import SettingsPage from './pages/settings';
import ProfilePage from './pages/profile';
import ChartsPage from './pages/charts';
import LogsPage from './pages/logs';
import AccessPage from './pages/access';
import TasksPage from './pages/tasks';
import TeamsPage from './pages/teams';
import MyTasksPage from './pages/my_tasks';

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

			// Login to Keycloak
			{ path: '/auth/callback/login', Component: LoginCallback },
			{ path: '/auth/callback/logout', Component: LoginCallback },

			{
				index: true,
				loader: () => {
					// console.log('I"M LOADING');
				},
				Component: LoginPage,
			},

			{ path: 'register', Component: RegisterPage },
			{ path: 'forgot_password', Component: ForgotPasswordPage },
			{ path: 'logged_out', Component: LoggedOutPage },
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
