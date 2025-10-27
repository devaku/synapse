type buttonStyle =
	| 'Primary'
	| 'Secondary'
	| 'Success'
	| 'Danger'
	| 'Warning'
	| 'Info';

interface buttonElement {
	text: string;
	className?: string;
}

interface buttonProps extends buttonElement {
	type: buttonStyle;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}

interface inputButtonProps extends buttonElement {
	buttonType: buttonStyle;
	type?: 'Submit';
}

export default function Button({
	type,
	text,
	className,
	onClick,
}: buttonProps) {
	let finalStyle = `w-full cursor-pointer text-center text-black p-2 rounded`;

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
			finalStyle += ` text-ttg-white bg-ttg-brown/70 hover:bg-ttg-brown`;
			break;
		case 'Danger':
			finalStyle += ` text-ttg-white bg-red-500 hover:bg-red-700`;
			break;
		case 'Warning':
			finalStyle += ` text-ttg-black bg-yellow-500 hover:bg-yellow-500/50`;
			break;
	}

	finalStyle += ` ${className ? className : ''}`;

	return (
		<button className={finalStyle} onClick={onClick}>
			{text}
		</button>
	);
}

export function InputButton({
	buttonType: type,
	type: inputType,
	text,
	className,
}: inputButtonProps) {
	let finalStyle = `w-full cursor-pointer text-center p-2 rounded`;

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
			finalStyle += ` text-ttg-white bg-ttg-brown/70 hover:bg-ttg-brown`;
			break;
		case 'Danger':
			finalStyle += ` text-ttg-white bg-red-500 hover:bg-red-500`;
			break;
		case 'Warning':
			finalStyle += ` text-ttg-black bg-yellow-500 hover:bg-yellow-500/50`;
			break;
	}

	finalStyle += ` ${className ? className : ''}`;

	return <input className={finalStyle} type={inputType} value={text} />;
}
