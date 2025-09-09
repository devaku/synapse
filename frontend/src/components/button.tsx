type buttonProps = {
	buttonType: string;
	buttonText: string;
	buttonOnClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Button(props: buttonProps) {
	let { buttonType, buttonText, buttonOnClick } = props;
	let style = ``;

	switch (buttonType) {
		case 'green':
			style = `cursor-pointer text-center text-black p-2 rounded-2xl ttg-bg-green `;
			break;
		case 'purple':
			style = `cursor-pointer text-center text-black p-2 rounded-2xl ttg-bg-purple `;
			break;
		case 'edit':
			style =
				'cursor-pointer text-center bg-[#DCD7FF] h-7 w-29 border-[#333333]/16 border-1 hover:bg-purple-300';
			break;
		case 'add':
			style =
				'cursor-pointer text-center bg-[#DCD7FF] h-7 w-29 border-[#333333]/16 border-1 hover:bg-purple-300';
			break;
	}

	return (
		<button className={style} onClick={buttonOnClick}>
			{buttonText}
		</button>
	);
}
