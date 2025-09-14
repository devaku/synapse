type chartCardProps = {
	cardLabel: string;
	className: string;
	cardText: string;
};

export default function ChartCard(props: chartCardProps) {
	let { className, cardLabel, cardText } = props;

	return (
		<div
			className={
				'bg-green-500 px-14 py-4 rounded-2xl min-w-52' + className
			}
		>
			<div className="text-2xl text-center">{cardLabel}</div>
			<div className="text-3xl text-center">{cardText}</div>
		</div>
	);
}
