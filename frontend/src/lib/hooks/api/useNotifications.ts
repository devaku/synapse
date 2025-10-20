import { useState, useEffect, useCallback } from 'react';
import type { User } from '../../../lib/types/models';
import { readAllNotifications } from '../../services/api/notifications';

import { useAuthContext } from '../../contexts/AuthContext';

interface Notification {
	id: number;
	title: string;
	description: string;
}

interface NotificationCard {
	title: string;
	description: string;
	sender: {
		firstName: string;
		lastName: string;
	};
	payload: any;
	setOpenState: (state: boolean) => void;
}

export function useNotifications() {
	const [notifications, setNotifications] = useState<NotificationCard[]>([]);
	const { token } = useAuthContext();

	const refresh = useCallback(async () => {
		try {
			const data: Notification[] = await readAllNotifications(token!);
			const notificationData: NotificationCard[] = [];

			for (const entry of data) {
				const newNotif: Partial<NotificationCard> = {};
				newNotif.title = entry.title;
				newNotif.description = entry.description;
				newNotif.sender = {
					firstName: 'ADMIN',
					lastName: 'ADMIN',
				};
				newNotif.payload = {
					taskId: 1,
					action: 'TASK:VIEW',
				};

				notificationData.push(newNotif as NotificationCard);
			}

			// Ensure data is an array
			if (Array.isArray(data)) {
				setNotifications(notificationData);
			} else {
				console.warn('API returned non-array data:', data);
				setNotifications([]);
			}
		} catch (err) {
			if (err instanceof Error) {
				console.log(err.message || 'Error fetching teams');
			}
		}
	}, [token]);

	useEffect(() => {
		refresh();
	}, [refresh]);

	return {
		notifications,
	};
}
