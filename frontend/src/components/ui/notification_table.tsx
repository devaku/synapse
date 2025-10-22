import { useEffect, type RefObject } from 'react';
import NotificationCard from './notification_card';
import type { User } from '../../lib/types/models';

interface NotificationCard {
	title: string;
	description: string;
	sender: User;
	payload: any;
	createdAt: Date;
	setOpenState: (state: boolean) => void;
}

export default function NotificationTable({
	data,
	ref,
	setOpenState,
}: {
	data: NotificationCard[];
	ref: RefObject<HTMLDivElement>;
	setOpenState: (state: boolean) => void;
}) {
	useEffect(() => {
		function clickHandler(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpenState(false);
			}
		}

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, [ref, setOpenState]);

	return (
		<div
			className="absolute h-100 w-80 mr-39 bg-ttg-white z-100 mt-14 hover:cursor-default border-1 border-ttg-black/15 flex flex-col overflow-y-scroll [scrollbar-width:none]"
			onClick={(e) => e.stopPropagation()}
		>
			<div className="fixed top-13.5 right-24.5 border-10 border-b-ttg-black/15 border-x-transparent border-t-transparent" />
			<h2 className="border-b-1 border-ttg-black/15 py-1 px-2 font-semibold fixed w-79.5 bg-ttg-white">
				Notifications
			</h2>
			<div className="pb-[33px]" />
			{data.map((entry, index) => (
				<NotificationCard
					key={index}
					title={entry.title}
					description={entry.description}
					sender={entry.sender}
					sendDate={entry.createdAt}
					payload={entry.payload}
					setOpenState={setOpenState}
				/>
			))}
		</div>
	);
}
