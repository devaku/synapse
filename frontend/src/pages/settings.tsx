import { useState, type JSX } from 'react';
import HeaderContainer from '../components/container/header_container';

export default function SettingsPage() {

	type Tab = {
		name: string,
		selected?: boolean,
		onClick?: () => void,
		content?: JSX.Element
	}

	function Tab({name, selected = false, onClick}: Tab) {
		return (
			<button 
				className={`w-40 h-10 flex items-center justify-center hover:cursor-pointer ${selected == true ? 'border-b-1 bg-black/5' : 'bg-black/15'}`}
				onClick={onClick}
			>{name}</button>
		);
	}

	function TabGroup({tabs}: {tabs: Array<Tab>}) {
		const [activeTab, setActiveTab] = useState(tabs[0].name)
		
		return (
			<div>
				<div className='flex'>
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
	
	return (
		<HeaderContainer pageTitle={'Settings'}>
			<TabGroup tabs={
				[
					{name: 'Appearance', content: 
						<div>
							<div className='flex flex-col gap-2 my-5'>
								<h2 className='text-3xl font-semibold'>Theme</h2>
								<p>Choose from either a light or dark theme.</p>
							</div>

							<div className='bg-gray-300 w-full h-[2px]' />

							<div className='flex flex-col gap-2 my-5'>
								<h2 className='text-3xl font-semibold'>Presentation</h2>
								<p>Choose either a comfortable or compact presentation.</p>
							</div>

							<div className='bg-gray-300 w-full h-[2px]' />
						</div>
					},
					{name: 'Notifications', content:
						<div>
							<div className='flex flex-col gap-2 my-5'>
								<h2 className='text-3xl font-semibold'>Preference</h2>
								<p>Notify me for the following:</p>
							</div>

							<div className='bg-gray-300 w-full h-[2px]' />

							<div className='flex flex-col gap-2 my-5'>
								<h2 className='text-3xl font-semibold'>Volume</h2>
								<p>How loud should a notification be?</p>
							</div>

							<div className='bg-gray-300 w-full h-[2px]' />
						</div>
					},
					{name: 'Category', content: 
						<div>

						</div>
					}
				]
			}/>
		</HeaderContainer>
	);
}
