import { Outlet } from 'react-router';
import { useEasterEgg } from '../../lib/hooks/ui/useEasterEgg';
import { useModal } from '../../lib/hooks/ui/useModal';
import { EasterEggModal } from '../modals/system/easter_egg_modal';

export default function RootLayout() {
	const easterEggModal = useModal(false);

	// Easter egg: Press Ctrl + Shift + Alt + C (for Credits)
	// Triple modifier combination is very safe and won't conflict with browser shortcuts
	useEasterEgg({
		sequence: ['Control', 'Shift', 'Alt', 'C'],
		onTrigger: () => {
			easterEggModal.open();
		},
	});

	return (
		<>
			<Outlet></Outlet>
			<EasterEggModal
				isOpen={easterEggModal.isOpen}
				onClose={easterEggModal.close}
			/>
		</>
	);
}
