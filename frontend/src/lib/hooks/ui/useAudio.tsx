import { useEffect, useRef, useState } from 'react';

type audioProps = {
	audioUrl: string;
	volume: number;
};

export function useAudio({ audioUrl, volume }: audioProps) {
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		const audioSource = new Audio(audioUrl);

		function handlePlay() {
			setIsPlaying(true);
		}

		function handleEnded() {
			setIsPlaying(false);
		}

		audioSource.volume = volume;

		audioSource.addEventListener('play', handlePlay);
		audioSource.addEventListener('ended', handleEnded);

		audioRef.current = audioSource;

		return () => {
			audioSource.removeEventListener('play', handlePlay);
			audioSource.removeEventListener('ended', handleEnded);
		};
	}, [audioUrl, volume]);

	function playSound() {
		// Do not play sound if it's already playing
		if (!isPlaying) {
			if (audioRef.current) {
				audioRef.current.play();
			}
		}
	}

	// function pauseSound(){}

	function stopSound() {
		if (isPlaying) {
			if (audioRef.current) {
				// Pause the playback
				audioRef.current.pause();
				// Reset to start
				audioRef.current.currentTime = 0;

				setIsPlaying(false);
			}
		}
	}

	return { stopSound, playSound, isPlaying };
}
