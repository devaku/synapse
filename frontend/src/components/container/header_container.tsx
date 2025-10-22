import React from 'react';

/**
 * HOOKS
 */
import { useNavigate } from 'react-router';
import { useAuthContext } from '../../lib/contexts/AuthContext';
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
	const { serverData } = useAuthContext();
	const navigate = useNavigate();

	const [notifOpen, setNotifOpen] = useState(false);
	const divRef = useRef(null);

	const { notifications } = useNotifications();

	return (
		<div className="flex flex-col bg-ttg-white text-ttg-black">
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
			<div className="flex-1 flex flex-col p-10 mb-10 min-h-0 ma">
				{children}
			</div>
		</div>
	);
}
