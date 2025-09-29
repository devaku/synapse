import { useState } from 'react';
import HeaderContainer from '../components/container/header_container';
import TabGroup from '../components/ui/tab_group';

export default function SettingsPage() {

	type Radio = {
		name: string;
		selected?: boolean;
		onClick?: () => void;
	};

	function Radio({ name, selected = false, onClick }: Radio) {
		return (
			<div className="flex items-center gap-2 w-40">
				<button
					onClick={onClick}
					className={`
					flex items-center justify-center size-5 rounded-full border-ttg-black/40
					hover:cursor-pointer hover:border-6
					${selected == true ? 'border-6 border-ttg-dark-blue' : 'border-2'}
				`}
				></button>
				<p>{name}</p>
			</div>
		);
	}

	function RadioGroup({ radios }: { radios: Array<Radio> }) {
		const [activeRadio, setActiveRadio] = useState(radios[0].name);

		return (
			<div className="flex my-5 ml-5">
				{radios.map((radio) => (
					<Radio
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
											onClick: () =>
												document.documentElement.setAttribute(
													'class',
													''
												),
										},
										{
											name: 'Dark',
											onClick: () =>
												document.documentElement.setAttribute(
													'class',
													'dark'
												),
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
