import { useEffect, type RefObject } from 'react';

type NotificationCard = {
	title: string;
	description: string;
	sender: string;
};

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

	function NotificationCard({
		title,
		description,
		sender,
	}: NotificationCard) {
		return (
			<div className="w-full border-b-1 border-ttg-black/15 py-1 px-2 flex flex-col">
				<h3 className="font-semibold">{title}</h3>
				<p className="text-sm text-ttg-black/75 line-clamp-2">
					{description}
				</p>
				<p className="text-xs text-ttg-black/60 mt-1">{sender}</p>
			</div>
		);
	}

	return (
		<div
			className="absolute h-100 w-80 mr-39 bg-ttg-white z-100 mt-14 hover:cursor-default border-1 border-ttg-black/15 flex flex-col overflow-y-scroll [scrollbar-width:none]"
			onClick={(e) => e.stopPropagation()}
		>
			<div className="fixed top-13.5 right-21 border-10 border-b-ttg-black/15 border-x-transparent border-t-transparent" />
			<h2 className="border-b-1 border-ttg-black/15 py-1 px-2 font-semibold fixed w-79.5 bg-ttg-white">Notifications</h2>
            <div className="pb-[33px]" />
			{data.map((entry) => (
				<NotificationCard
					title={entry.title}
					description={entry.description}
					sender={entry.sender}
				/>
			))}
		</div>
	);
}
