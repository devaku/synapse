import { useState, useEffect } from 'react';

import { useAudio } from '../../lib/hooks/ui/useAudio';

/**
 * COMPONENTS
 */
import SvgComponent from './svg_component';

type mediaPlayerType = {
	title: string;
	volume: number;
	audioUrl: string;
};

export default function MediaPlayer({
	title,
	volume,
	audioUrl,
}: mediaPlayerType) {
	const { isPlaying, playSound, stopSound } = useAudio({ audioUrl, volume });

	function handleButtonPlay() {
		playSound();
	}

	function handleButtonStop() {
		stopSound();
	}

	return (
		<div className="flex items-center gap-2">
			<p>{title}</p>
			{isPlaying ? (
				<button onClick={handleButtonStop} className="cursor-pointer">
					<SvgComponent
						className="w-10"
						iconName="STOP"
					></SvgComponent>
				</button>
			) : (
				<button onClick={handleButtonPlay} className="cursor-pointer">
					<SvgComponent
						className="w-10"
						iconName="PLAY"
					></SvgComponent>
				</button>
			)}
		</div>
	);
}
