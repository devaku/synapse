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
	/**
	 * isRender ensures whether the element is in the DOM
	 */
	const [isRender, setIsRender] = useState<boolean>(false);

	/**
	 * isVisible ensures to have a transitionary state to play the animation
	 */
	const [isVisible, setIsVisible] = useState<boolean>(false);

	useEffect(() => {
		if (isOpen) {
			setIsRender(isOpen);
			setTimeout(() => {
				setIsVisible(true);
			}, 10);
		} else {
			setIsVisible(false);
		}
	}, [isOpen]);

	function handleTransitionEnd() {
		// If closing
		if (!isOpen) {
			setIsRender(false);
		}
	}

	if (isRender) {
		return createPortal(
			<div
				className={
					'absolute z-10 top-0 h-screen flex w-full items-center justify-center dim-background ' +
					(isVisible ? 'bg-black/50' : 'bg-black/0')
				}
				onTransitionEnd={handleTransitionEnd}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div
					className={
						'h-fit bg-white w-xl fade ' +
						(isVisible ? 'opacity-100' : 'opacity-0')
					}
				>
					{children}
				</div>
			</div>,
			document.body
		);
	} else {
		return <></>;
	}
}
