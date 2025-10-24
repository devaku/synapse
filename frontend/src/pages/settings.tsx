import { useState, useRef } from 'react';
import HeaderContainer from '../components/container/header_container';
import TabGroup from '../components/ui/tab_group';

import RadioGroup from '../components/ui/radio_group';

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
							<div>
								<div className="flex flex-col gap-2 my-5">
									<h2 className="text-3xl font-semibold">
										Preference
									</h2>
									<p>Notify me for the following:</p>
								</div>

								<div className="bg-gray-300 w-full h-[2px]" />

								<div className="flex flex-col gap-2 my-5">
									<h2 className="text-3xl font-semibold">
										Volume
									</h2>
									<p>How loud should a notification be?</p>
								</div>

								<div className="bg-gray-300 w-full h-[2px]" />
							</div>
						),
					},
					{ name: 'Category', content: <div></div> },
				]}
			/>
		</HeaderContainer>
	);
}
