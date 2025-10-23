type buttonStyle =
	| 'Primary'
	| 'Secondary'
	| 'Success'
	| 'Danger'
	| 'Warning'
	| 'Info';

type buttonProps = {
	type: buttonStyle;
	text: string;
	className?: string;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Button({
	type,
	text,
	className,
	onClick,
}: buttonProps) {
	let finalStyle = `cursor-pointer text-center text-black p-2 rounded-2xl`;

	switch (type) {
		case 'Primary':
			finalStyle += ` text-ttg-white bg-ttg-green hover:bg-ttg-green/50`;
			break;
		case 'Secondary':
			finalStyle += ` text-ttg-white bg-ttg-purple hover:bg-ttg-purple/50`;
			break;
		case 'Success':
			finalStyle += ` text-ttg-black bg-green-500 hover:bg-green-700`;
			break;
		case 'Info':
			finalStyle += ` text-ttg-white bg-ttg-brown hover:bg-ttg-brown/50`;
			break;
		case 'Danger':
			finalStyle += ` text-ttg-white bg-red-500 hover:bg-red-500/50`;
			break;
		case 'Warning':
			finalStyle += ` text-ttg-black bg-yellow-500 hover:bg-yellow-500/50`;
			break;
	}

	finalStyle += ` ${className}`;

	return (
		<button className={finalStyle} onClick={onClick}>
			{text}
		</button>
	);
}
