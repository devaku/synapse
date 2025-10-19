import React from 'react';

/**
 * HOOKS
 */
import { useNavigate } from 'react-router';
import { useAuthContext } from '../../lib/contexts/AuthContext';
import { useState, useEffect, useRef, type RefObject } from 'react';
import { useSocketContext } from '../../lib/contexts/SocketContext';

/**
 * COMPONENTS
 */
import SvgComponent from '../ui/svg_component';
import NotificationTable from '../ui/notification_table';

import * as socketEvents from '../../lib/helpers/socket-events';

export default function HeaderContainer({
	children,
	pageTitle,
}: {
	children: React.ReactNode;
	pageTitle: string;
}) {
	const { socket } = useSocketContext();
	const { serverData } = useAuthContext();
	const navigate = useNavigate();

	const [notifOpen, setNotifOpen] = useState(false);
	const divRef = useRef(null);

	const testNotifications = [
		{
			id: 1,
			title: 'DEBUG NOTIFICATION',
			description: 'This is a notification that will bring you to Task 1',
			createdByUserId: 1,
			user: {
				firstName: 'ADMIN',
				lastName: 'ADMIN',
			},
			payload: {
				taskId: 1,
				action: 'TASK:VIEW',
			},
			createdAt: new Date(),
		},
		{
			id: 1,
			title: 'DEBUG NOTIFICATION',
			description: 'This is a notification that will bring you to Task 2',
			createdByUserId: 1,
			user: {
				firstName: 'ADMIN',
				lastName: 'ADMIN',
			},
			payload: {
				taskId: 2,
				action: 'TASK:VIEW',
			},
			createdAt: new Date(),
		},
		{
			id: 1,
			title: 'DEBUG NOTIFICATION',
			description: 'This is a notification that will bring you to Task 3',
			createdByUserId: 1,
			user: {
				firstName: 'ADMIN',
				lastName: 'ADMIN',
			},
			payload: {
				taskId: 3,
				action: 'TASK:VIEW',
			},
			createdAt: new Date(),
		},
	];

	useEffect(() => {
		// Fetch all the unread notifications for the current user
	}, []);

	// Subscribe to Socket

	useEffect(() => {
		async function start() {
			// This should be put into its own thing
			playSound();
		}

		socket?.on(socketEvents.NOTIFICATION.NOTIFICATION, start);
		return () => {
			socket?.off(socketEvents.NOTIFICATION.NOTIFICATION, start);
		};
	}, [socket]);

	function playSound() {
		const url = `${import.meta.env.VITE_FRONTEND_URL}/notification1.mp3`;

		const audio = new Audio(url);
		audio.play();
	}

	return (
		<div className="w-full flex flex-col bg-ttg-white text-ttg-black max-h-screen">
			{/* Header */}
			<div className="flex flex-row h-15 bg-ttg-black/5 items-center justify-between">
				{/* Left Side */}
				<div className="text-3xl font-bold text-center text-ttg-black px-7.5 cursor-default">
					{pageTitle}
				</div>
				{/* Right Side */}
				<div className="flex flex-row items-center  gap-9 px-5">
					<button
						className="text-ttg-black cursor-pointer"
						onClick={() => {
							navigate('/settings');
						}}
					>
						Settings
					</button>
					<div
						className="cursor-pointer flex flex-col items-center"
						onClick={() => {
							setNotifOpen(!notifOpen);
						}}
						ref={divRef}
					>
						<SvgComponent iconName="Bell" />
						{notifOpen && (
							<NotificationTable
								data={testNotifications}
								ref={
									divRef as unknown as RefObject<HTMLDivElement>
								}
								setOpenState={setNotifOpen}
							/>
						)}
					</div>
					{/* PROFILE IMAGE */}
					<div
						className="cursor-pointer flex items-center"
						onClick={() => {
							navigate('/profile');
						}}
					>
						<img
							className="w-10 h-10 rounded-2xl"
							src={serverData.image?.imageUrl}
							alt=""
						/>
					</div>
				</div>
			</div>
			{/* Page content */}
			<div className="overflow-y-auto overflow-x-auto max-h-screen p-10 mb-10 min-h-0 ma">
				{children}
			</div>
		</div>
	);
}
