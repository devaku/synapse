import { useState, type JSX } from 'react';

type Tab = {
        name: string;
        selected?: boolean;
        onClick?: () => void;
        content?: JSX.Element;
};

export default function TabGroup({ tabs }: { tabs: Array<Tab> }) {
    const [activeTab, setActiveTab] = useState(tabs[0].name);

    function Tab({ name, selected = false, onClick }: Tab) {
		return (
			<button
				className={`w-40 h-10 flex items-center justify-center hover:cursor-pointer ${
					selected == true
						? 'border-b-1 bg-ttg-black/5'
						: 'bg-ttg-black/15'
				}`}
				onClick={onClick}
			>
				{name}
			</button>
		);
	}
    
    return (
        <div>
            <div className="flex">
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