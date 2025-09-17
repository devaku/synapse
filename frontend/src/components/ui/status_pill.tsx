type statusPillProps = {
	text: string;
};

export default function StatusPill({ text }: statusPillProps) {
	let finalhtml;
	const style = 'text-sm text-center h-7.5 p-1 rounded-xl md:w-24 max-md:w-7';
	const pillstyle = 'max-md:hidden md:visible';
	switch (text) {
		case 'DELIVERED':
			finalhtml = (
				<div className={style + ' bg-green-200 text-green-700'}>
					<div className={pillstyle}>{text}</div>
				</div>
			);
			break;
		case 'URGENT':
		case 'OVERDUE':
			finalhtml = (
				<div className={style + ' bg-red-200 text-red-700'}>
					<div className={pillstyle}>{text}</div>
				</div>
			);
			break;
		case 'PENDING':
			finalhtml = (
				<div className={style + ' bg-orange-200 text-orange-700'}>
					<div className={pillstyle}>{text}</div>
				</div>
			);
			break;
		case 'READ':
			finalhtml = (
				<div className={style + ' bg-green-200 text-green-700'}>
					<div className={pillstyle}>{text}</div>
				</div>
			);
			break;
		case 'UNREAD':
			finalhtml = (
				<div className={style + ' bg-red-200 text-red-700'}>
					<div className={pillstyle}>{text}</div>
				</div>
			);
			break;
	}

	return finalhtml;
}
