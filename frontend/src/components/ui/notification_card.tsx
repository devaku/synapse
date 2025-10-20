import type { User } from '../../lib/types/models';

import { useNavigate } from 'react-router';

import { PAYLOAD_ACTIONS } from '../../lib/helpers/socket-events';

type typeNotificationCard = {
	title: string;
	description: string;
	sender: User;
	payload: any;
	setOpenState: (state: boolean) => void;
};

export default function NotificationCard({
	title,
	description,
	sender,
	payload,
	setOpenState,
}: typeNotificationCard) {
	const navigate = useNavigate();

	function buildUrl() {
		if (payload.action == PAYLOAD_ACTIONS.TASK_VIEW) {
			const url = `/tasks?view=${payload.taskId}`;
			return url;
		} else {
			return '';
		}
	}

	function handleNotificationClick(e: React.MouseEvent<HTMLDivElement>) {
		setOpenState(false);
		navigate(buildUrl());
	}

	return (
		<div
			onClick={handleNotificationClick}
			className="cursor-pointer w-full border-b-1 border-ttg-black/15 py-1 px-2 flex flex-col"
		>
			<h3 className="font-semibold">{title}</h3>
			<p className="text-sm text-ttg-black/75 line-clamp-2">
				{description}
			</p>
			<div className="flex justify-between">
				<p className="text-xs text-ttg-black/60 mt-1">ADMIN ADMIN</p>
				<p className="text-xs text-ttg-black/60 mt-1">DATE</p>
			</div>
		</div>
	);
}
