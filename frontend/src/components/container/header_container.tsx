import React from 'react';

/**
 * HOOKS
 */
import { useNavigate } from 'react-router';
import { useAuthContext } from '../../lib/contexts/AuthContext';
import { useSoundContext } from '../../lib/contexts/SoundContext';
import { useState, useEffect, useRef, type RefObject } from 'react';
import { useNotifications } from '../../lib/hooks/api/useNotifications';

/**
 * COMPONENTS
 */
import SvgComponent from '../ui/svg_component';
import NotificationTable from '../ui/notification_table';

export default function HeaderContainer({
	children,
	pageTitle,
}: {
	children: React.ReactNode;
	pageTitle: string;
}) {
	const { isPlaying } = useSoundContext();
	const { serverData } = useAuthContext();
	const navigate = useNavigate();

	const [notifOpen, setNotifOpen] = useState(false);
	const [notificationCount, setNotificationCount] = useState<number>(0);
	const [readNotifications, setReadNotifications] = useState(true);
	const divRef = useRef(null);

	const { notifications } = useNotifications();

	useEffect(() => {
		if (notificationCount > notifications.length) {
			setNotificationCount(notifications.length);
			setReadNotifications(false);
		}
	}, [notifications]);

	return (
		<div className="w-full h-full flex flex-col bg-ttg-white text-ttg-black ">
			{/* Header */}
			<div className="flex flex-row h-15 bg-ttg-black/5 items-center justify-between">
				{/* Left Side */}
				<div className="text-3xl font-bold text-center text-ttg-black px-7.5 cursor-default">
					{pageTitle}
				</div>
				{/* Right Side */}
				<div className="flex flex-row items-center gap-9 px-5">
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
							setReadNotifications(true);
						}}
						ref={divRef}
					>
						<div>
							{isPlaying ? (
								<div className="shake">
									<SvgComponent
										className="w-7"
										iconName="Bell_ACTIVE"
									/>
								</div>
							) : (
								<>
									{readNotifications ? (
										<div className="">
											<SvgComponent
												className="w-7"
												iconName="Bell"
											/>
										</div>
									) : (
										// There are unread notifications
										<div className="">
											<SvgComponent
												className="w-7"
												iconName="Bell_unread"
											/>
										</div>
									)}
								</>
							)}
						</div>

						{notifOpen && (
							<NotificationTable
								data={notifications}
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
			<div className="flex-1 overflow-y-auto p-10 mb-10 min-h-0 ma">
				{children}
			</div>
		</div>
	);
}
