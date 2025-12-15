import Button from '../../ui/button';
import PopupModalContainer from '../../container/modal_containers/popup_modal_container';

interface EasterEggModalProps {
	isOpen: boolean;
	onClose: () => void;
}

interface Developer {
	name: string;
	linkedinUrl?: string;
}

const developers: Developer[] = [
	{ name: 'Kim', linkedinUrl: 'https://www.linkedin.com/in/devaku/' },
	{ name: 'Theodore', linkedinUrl: 'https://www.linkedin.com/in/theodore-frocklage/' },
	{ name: 'Pedro', linkedinUrl: 'https://www.linkedin.com/in/pedro-henrique-gomes-de-toledo/' },
	{ name: 'Jimmy', linkedinUrl: 'https://www.linkedin.com/in/george-sabo/' },
	{ name: 'Joseph', linkedinUrl: 'https://www.linkedin.com/in/josephandrewsabo/' },
];

export function EasterEggModal({ isOpen, onClose }: EasterEggModalProps) {
	return (
		<PopupModalContainer isOpen={isOpen}>
			<div className="flex flex-col mx-12 my-8 gap-6 max-w-lg">
				<div className="text-center">
					<h2 className="text-4xl font-bold mb-4">🎉 Credits</h2>
					<p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
						Credits for this application go to the developers during their 2025 capstone project:
					</p>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700">
					<ul className="space-y-3">
						{developers.map((dev, index) => (
							<li key={index} className="flex items-center justify-between">
								<span className="text-lg font-medium text-gray-800 dark:text-gray-200">
									{dev.name}
								</span>
								{dev.linkedinUrl ? (
									<a
										href={dev.linkedinUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
									>
										LinkedIn →
									</a>
								) : (
									<button
										disabled
										className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-md text-sm font-medium cursor-not-allowed"
									>
										LinkedIn →
									</button>
								)}
							</li>
						))}
					</ul>
				</div>

				<div className="text-center text-sm text-gray-600 dark:text-gray-400">
					<p>Developed as part of the 2025 Capstone Project</p>
					<p className="mt-2">Synapse - Task Management System</p>
				</div>

				<div className="flex justify-center gap-4">
					<Button
						type="Info"
						text="Close"
						onClick={onClose}
					/>
				</div>
			</div>
		</PopupModalContainer>
	);
}

