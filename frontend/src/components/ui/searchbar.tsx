import { useState } from "react";

export default function SearchBar({
	placeholder,
	onSearch,
	value,
}: {
	placeholder: string;
	onSearch: (text: string) => void;
	value: string;
}) {

    const [inputValue, setInputValue] = useState('');

	return (
		<div className="flex flex-row gap-1 pb-1">
			<input
				type="text"
				placeholder={'Search ' + placeholder}
				value={value}
				onChange={(e) => onSearch(e.target.value)}
                className="p-2 border rounded-md active:border-gray-500 border-gray-300"
			/>
                <button onClick={() => {setInputValue(''); onSearch('')}} className="w-10 h-10 border border-gray-400 bg-gray-400 text-white rounded-md hover:border-gray-700 hover:bg-gray-700">
                    X
                </button>
		</div>
	);
}
