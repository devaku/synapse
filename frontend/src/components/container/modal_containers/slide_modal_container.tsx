import { createPortal } from 'react-dom';
import { useState, useEffect, useRef } from 'react';

type ModalContainer = {
	isOpen: boolean;
	close: () => void;
	children: React.ReactNode;
	noFade: boolean;
};

export default function SlideModalContainer({
	isOpen,
	close,
	children,
	noFade,
}: ModalContainer) {
	const [shouldRender, setShouldRender] = useState<boolean>();
	const [playAnimation, setPlayAnimation] = useState<boolean>();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
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

	useEffect(() => {
		function clickHandler(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				close()
			}
		}

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, [ref]);

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
					'absolute z-10 top-0 w-full overflow-hidden flex grow items-end justify-end dim-background ' +
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
					<div className="h-screen bg-ttg-white w-xl text-ttg-black" ref={ref}>
						{children}
					</div>
				</div>
			</div>,
			document.body
		);
	} else {
		return '';
	}
}
