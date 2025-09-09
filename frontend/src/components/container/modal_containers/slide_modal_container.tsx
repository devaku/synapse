import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';

type ModalContainer = {
	isOpen: boolean;
	children: React.ReactNode;
	noFade: boolean;
};

export default function SlideModalContainer({
	isOpen,
	children,
	noFade,
}: ModalContainer) {
	const [shouldRender, setShouldRender] = useState<boolean>();
	const [playAnimation, setPlayAnimation] = useState<boolean>();

	useEffect(() => {
		// On open of the modal, display the HTML
		if (isOpen) {
			setShouldRender(true);

			// Once HTML is in, give delay
			// before animation plays.
			setTimeout(() => {
				setPlayAnimation(true);
			}, 100);
		} else {
			// Fade out the overlay
			setPlayAnimation(false);

			// Wait for the animation
			// of the animation to finish before
			// closing the modal proper
			setTimeout(() => {
				setShouldRender(false);
			}, 300);
		}
	}, [isOpen]);

	function handleFade() {
		if (noFade) {
			return 'bg-black/0';
		}

		if (playAnimation) {
			return 'bg-black/50';
		} else {
			return 'bg-black/0';
		}
	}

	if (shouldRender) {
		return createPortal(
			<div
				className={
					'absolute top-0 w-full overflow-hidden flex grow items-end justify-end dim-background ' +
					handleFade()
				}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div
					className={
						'relative slide-in ' +
						(playAnimation ? '-right-0' : '-right-200')
					}
				>
					<div className="h-screen bg-white w-xl">{children}</div>
				</div>
			</div>,
			document.body
		);
	} else {
		return '';
	}
}
