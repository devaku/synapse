import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';

type ModalContainer = {
	isOpen: boolean;
	children: React.ReactNode;
};

export default function PopupModalContainer({
	isOpen,
	children,
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
			}, 10);
		} else {
			// Fade out the overlay
			setPlayAnimation(false);

			// Wait for the animation
			// of the animation to finish before
			// closing the modal proper
			setTimeout(() => {
				setShouldRender(false);
			}, 500);
		}
	}, [isOpen]);

	if (shouldRender) {
		return createPortal(
			<div
				className={
					'absolute top-0 w-screen h-screen flex items-center justify-center ' +
					(playAnimation ? 'bg-black/50' : 'bg-black/0')
				}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div
					className={
						' ' + (playAnimation ? 'opacity-100' : 'opacity-0')
					}
				>
					<div className="min-h-80 bg-white w-xl">{children}</div>
				</div>
			</div>,
			document.body
		);
	} else {
		return '';
	}
}
