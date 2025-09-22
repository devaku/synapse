import { useState, useCallback } from 'react';

export function useModal(initialState: boolean = false) {
	const [isOpen, setIsOpen] = useState(initialState);

	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);
	const toggle = () => setIsOpen((prev) => !prev);

	return { isOpen, open, close, toggle };
}
