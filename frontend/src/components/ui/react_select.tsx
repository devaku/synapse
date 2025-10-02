import Select, { type MultiValue } from 'react-select';

// Define the shape of an option
type OptionType = {
	value: string;
	label: string;
};

type reactSelect = {
	placeholder: string;
	options: OptionType[];
	selectValue: OptionType[];
	setSelectValue: React.Dispatch<React.SetStateAction<any>>;
};

export default function ReactSelect({
	options,
	placeholder,
	selectValue,
	setSelectValue,
}: reactSelect) {
	const handleChange = (selected: MultiValue<OptionType>) => {
		setSelectValue([...selected]);
	};
	return (
		<Select
			className="w-full"
			isMulti
			value={selectValue}
			options={options}
			isClearable={true}
			onChange={handleChange}
			placeholder={placeholder}
		/>
	);
}
