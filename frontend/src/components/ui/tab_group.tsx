import { useState, type JSX } from 'react';

type Tab = {
	name: string;
	selected?: boolean;
	onClick?: () => void;
	content?: JSX.Element;
};

export enum TabGroupStyle {
	Default,
	Title,
}

const styles = [
	{
		// Default
		base: 'w-40 h-10 flex items-center justify-center hover:cursor-pointer',
		selected: 'border-b-1 bg-ttg-black/5',
		unselected: 'bg-ttg-black/15',
		div: 'flex',
	},
	{
		// Title
		base: 'text-3xl font-semibold w-60 h-12 flex items-center justify-center hover:cursor-pointer border-b-2',
		selected: 'border-ttg-black',
		unselected: 'border-ttg-white',
		div: 'flex justify-center',
	},
];

export default function TabGroup({
	tabs,
	style = TabGroupStyle.Default,
}: {
	tabs: Array<Tab>;
	style?: TabGroupStyle;
}) {
	const [activeTab, setActiveTab] = useState(tabs[0].name);

	function Tab({ name, selected = false, onClick }: Tab) {
		return (
			<button
				className={
					styles[style].base +
					' ' +
					(selected == true
						? styles[style].selected
						: styles[style].unselected)
				}
				onClick={onClick}
			>
				{name}
			</button>
		);
	}

	return (
		<div>
			<div className={styles[style].div}>
				{tabs.map((tab) => (
					<Tab
						name={tab.name}
						selected={tab.name === activeTab}
						onClick={() => setActiveTab(tab.name)}
					/>
				))}
			</div>
			{tabs.find((tab) => tab.name === activeTab)?.content}
		</div>
	);
}
