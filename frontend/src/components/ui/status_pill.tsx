type statusPillProps = {
	text: string;
};

export default function StatusPill({ text }: statusPillProps) {
	let finalhtml;
	let style = 'text-sm text-center p-1 rounded-xl min-w-24';
	switch (text) {
		case 'DELIVERED':
			finalhtml = (
				<div className={style + ' bg-green-200 text-green-700'}>
					{text}
				</div>
			);
			break;
		case 'OVERDUE':
			finalhtml = (
				<div className={style + ' bg-red-200 text-red-700'}>{text}</div>
			);
			break;
		case 'PENDING':
			finalhtml = (
				<div className={style + ' bg-orange-200 text-orange-700'}>
					{text}
				</div>
			);
			break;
		case 'READ':
			finalhtml = (
				<div className={style + ' bg-green-200 text-green-700'}>
					{text}
				</div>
			);
			break;
		case 'UNREAD':
			finalhtml = (
				<div className={style + ' bg-red-200 text-red-700'}>{text}</div>
			);
			break;
	}

	return finalhtml;
}
