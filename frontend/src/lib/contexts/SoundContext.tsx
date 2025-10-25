import { useContext, createContext, useEffect, useState } from 'react';

import { useAudio } from '../hooks/ui/useAudio';

type soundContextType = {
	setNotificationSound: (notificationChoice: string) => void;
	setNotificationVolume: (vol: number) => void;
	playSound: () => void;
	stopSound: () => void;
	isPlaying: boolean;
};

const SoundContext = createContext<soundContextType>({
	setNotificationSound: (notificationChoice: string) => {},
	setNotificationVolume: (vol: number) => {},
	playSound: () => {},
	stopSound: () => {},
	isPlaying: false,
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
	const [notificationSoundUrl, setNotificationSoundUrl] =
		useState<string>('');

	const [volume, setVolume] = useState<number>(1);

	const { playSound, isPlaying, stopSound } = useAudio({
		audioUrl: notificationSoundUrl,
		volume,
	});

	useEffect(() => {
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

		setNotificationSoundUrl(url);
		setVolume(volume);
	}, []);

	function setNotificationSound(notificationChoice: string) {
		localStorage.setItem('NOTIFICATION_SOUND', notificationChoice);
		const url = `${
			import.meta.env.VITE_FRONTEND_URL
		}/${notificationChoice}.mp3`;

		setNotificationSoundUrl(url);
	}

	function setNotificationVolume(vol: number) {
		localStorage.setItem('NOTIFICATION_VOLUME', vol.toString());
		setVolume(vol);
	}

	const value: soundContextType = {
		setNotificationSound,
		setNotificationVolume,
		playSound,
		stopSound,
		isPlaying,
	};

	return (
		<SoundContext.Provider value={value}>{children}</SoundContext.Provider>
	);
}

export function useSoundContext() {
	return useContext(SoundContext);
}
