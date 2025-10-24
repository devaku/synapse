import { useState, useEffect } from 'react';

/**
 * HOOKS
 */

import { useSocketContext } from '../../contexts/SocketContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { useAudio } from '../ui/useAudio';

/**
 * SERVICES
 */

import { readAllNotifications } from '../../services/api/notifications';
import * as socketEvents from '../../../lib/helpers/socket-events';
import { type Notification, type User } from '../../types/models';

interface NotificationCard {
	title: string;
	description: string;
	sender: User;
	payload: any;
	createdAt: Date;
	setOpenState: (state: boolean) => void;
}

export function useNotifications() {
	const { socket } = useSocketContext();
	const { token } = useAuthContext();
	const [notificationSoundUrl, setNotificationSoundUrl] =
		useState<string>('');
	const [notificationVolume, setNotificationVolume] = useState<number>(1);
	const { playSound } = useAudio({
		audioUrl: notificationSoundUrl,
		volume: notificationVolume,
	});

	const [notifications, setNotifications] = useState<NotificationCard[]>([]);

	async function fetchNotifications() {
		try {
			const data: Notification[] = await readAllNotifications(token!);
			const notificationData: NotificationCard[] = [];

			for (const entry of data) {
				const newNotif: Partial<NotificationCard> = {};
				newNotif.title = entry.title;
				newNotif.description = entry.description;
				newNotif.sender = {
					...entry.user,
					firstName: entry.user.firstName!,
					lastName: entry.user.lastName!,
				};
				newNotif.payload = { ...entry.payload };
				newNotif.createdAt = entry.createdAt;

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
	}

	/**
	 * USE EFFECT
	 */

	useEffect(() => {
		const { url, volume } = setupAudioSource();
		setNotificationSoundUrl(url);
		setNotificationVolume(volume);
	}, []);

	// Fetch notifications on initial load
	useEffect(() => {
		async function start() {
			await fetchNotifications();
		}
		start();
	}, [token]);

	// Subscribe to Socket
	useEffect(() => {
		async function start() {
			playSound();
			await fetchNotifications();
		}

		socket?.on(socketEvents.NOTIFICATION.NOTIFICATION, start);
		return () => {
			socket?.off(socketEvents.NOTIFICATION.NOTIFICATION, start);
		};
	}, [token, socket]);

	function debugPlayNotification() {
		playSound();
	}

	function setNotificationSound(notificationChoice: string) {
		localStorage.setItem('NOTIFICATION_SOUND', notificationChoice);
		const url = `${
			import.meta.env.VITE_FRONTEND_URL
		}/${notificationChoice}.mp3`;

		setNotificationSoundUrl(url);
	}

	function setVolume(volume: number) {
		localStorage.setItem('NOTIFICATION_VOLUME', volume.toString());
		setNotificationVolume(volume);
	}

	return {
		notifications,
		debugPlayNotification,
		setNotificationSound,
		setVolume,
	};
}

function setupAudioSource() {
	let notificationChoice = localStorage.getItem('NOTIFICATION_SOUND');
	let volume = Number(localStorage.getItem('NOTIFICATION_VOLUME'));
	if (!notificationChoice) {
		// Set the default
		localStorage.setItem('NOTIFICATION_SOUND', 'notification1');
		localStorage.setItem('NOTIFICATION_VOLUME', '1');
		notificationChoice = 'notification1';
		volume = 1;
	}
	const url = `${
		import.meta.env.VITE_FRONTEND_URL
	}/${notificationChoice}.mp3`;

	return { url, volume };
}
