import { useState, useRef } from 'react';
import HeaderContainer from '../components/container/header_container';

import TabNotification from '../components/tabs/tab_notification';
import TabGroup from '../components/ui/tab_group';
import RadioGroup from '../components/ui/radio_group';
import SelectGroup from '../components/ui/select_group';

export default function SettingsPage() {
	return (
		<HeaderContainer pageTitle={'Settings'}>
			<TabGroup
				tabs={[
					{
						name: 'Appearance',
						content: (
							<div className="">
								<div className="flex flex-col gap-2 mt-5">
									<h2 className="text-3xl font-semibold">
										Theme
									</h2>
									<p>
										Choose from either a light or dark
										theme.
									</p>
								</div>

								<RadioGroup
									radios={[
										{
											name: 'Light',
											onClick: () => {
												document.documentElement.setAttribute(
													'class',
													''
												);
												localStorage.setItem(
													'theme',
													'light'
												);
											},
										},
										{
											name: 'Dark',
											onClick: () => {
												document.documentElement.setAttribute(
													'class',
													'dark'
												);
												localStorage.setItem(
													'theme',
													'dark'
												);
											},
										},
									]}
								/>

								<div className="bg-gray-300 w-full h-[2px]" />

								<div className="flex flex-col gap-2 my-5">
									<h2 className="text-3xl font-semibold">
										Presentation
									</h2>
									<p>
										Choose either a comfortable or compact
										presentation.
									</p>
								</div>

								<RadioGroup
									radios={[
										{ name: 'Comfortable' },
										{ name: 'Compact' },
									]}
								/>

								<div className="bg-gray-300 w-full h-[2px]" />
							</div>
						),
					},
					{
						name: 'Notifications',
						content: (
							<>
								<div className="flex flex-col gap-2 my-5">
									<h2 className="text-3xl font-semibold">
										Notification Filters
									</h2>
									<p>
										For which categories should you receive
										notifications?
									</p>
								</div>

								<SelectGroup
									selectionBoxes={[
										{ name: 'Task Creation' },
										{ name: 'Task Completion' },
										{ name: 'Comments' },
									]}
								/>
								<TabNotification />
							</>
						),
					},
					{ name: 'Category', content: <div></div> },
				]}
			/>
		</HeaderContainer>
	);
}
