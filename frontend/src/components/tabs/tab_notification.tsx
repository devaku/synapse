import { useState, useEffect } from 'react';
import { useSoundContext } from '../../lib/contexts/SoundContext';
import MediaPlayer from '../ui/mediaplayer';
import Button from '../ui/button';

export default function TabNotification() {
	let currentNotification = localStorage.getItem('NOTIFICATION_SOUND');
	if (!currentNotification) {
		currentNotification = 'notification1';
	}
	const [notification, setNotification] =
		useState<string>(currentNotification);

	const { setNotificationSound, setNotificationVolume } = useSoundContext();

	const options = [
		'notification1',
		'notification2',
		'notification3',
		'notification4',
		'notification5',
		'notification6',
	];

	const url = `${import.meta.env.VITE_FRONTEND_URL}/`;

	function handleSelectClick(el: string) {
		setNotification(el);
		setNotificationSound(el);
	}

	return (
		<div>
			<div className="flex flex-col gap-2 my-5">
				<h2 className="text-3xl font-semibold">Notification Sound</h2>
				<p>Selected Choice: {notification}</p>

				<div className="bg-gray-300 w-full h-[2px]" />
				<div>Options: </div>

				<div className="grid grid-cols-2 gap-2 w-lg">
					{options.map((el, index) => {
						return (
							<div key={index} className="flex gap-2">
								<MediaPlayer
									audioUrl={url + el + '.mp3'}
									title={el}
									volume={1}
								></MediaPlayer>
								<div className="w-fit">
									<Button
										text="Select"
										type="Success"
										onClick={() => {
											handleSelectClick(el);
										}}
									></Button>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="bg-gray-300 w-full h-[2px]" />
		</div>
	);
}
