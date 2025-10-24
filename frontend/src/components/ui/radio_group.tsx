import { useState, useRef } from 'react';
import { type radioType } from '../../lib/types/custom';
import { Radio } from './radio';

export default function RadioGroup({ radios }: { radios: Array<radioType> }) {
	const theme = useRef(localStorage.getItem('theme') || 'light');

	let defaultRadio: radioType;
	if (theme.current === 'dark') {
		defaultRadio = radios[1];
	} else {
		defaultRadio = radios[0];
	}

	const [activeRadio, setActiveRadio] = useState(defaultRadio.name);

	return (
		<div className="flex my-5 ml-5">
			{radios.map((radio, index) => (
				<Radio
					key={index}
					name={radio.name}
					selected={radio.name === activeRadio}
					onClick={() => {
						setActiveRadio(radio.name);
						if (radio.onClick === undefined) {
							return;
						}
						radio.onClick();
					}}
				/>
			))}
		</div>
	);
}
