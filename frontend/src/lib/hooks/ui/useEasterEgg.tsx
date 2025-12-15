import { useEffect, useCallback } from 'react';

type KeySequence = string[];

interface UseEasterEggOptions {
	sequence: KeySequence;
	onTrigger: () => void;
	enabled?: boolean;
}

/**
 * Hook to detect a key combination (easter egg)
 * Handles simultaneous modifier keys (Ctrl, Shift, Alt) + a final key
 * 
 * @example
 * useEasterEgg({
 *   sequence: ['Control', 'Shift', 'Alt', 'C'],
 *   onTrigger: () => console.log('Easter egg triggered!'),
 * });
 */
export function useEasterEgg({
	sequence,
	onTrigger,
	enabled = true,
}: UseEasterEggOptions) {
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (!enabled) return;

			// Check if all keys in the sequence are currently pressed
			const pressedKeys = new Set<string>();
			
			// Add modifier keys if they're pressed
			if (event.ctrlKey) pressedKeys.add('Control');
			if (event.shiftKey) pressedKeys.add('Shift');
			if (event.altKey) pressedKeys.add('Alt');
			if (event.metaKey) pressedKeys.add('Meta');
			
			// Add the actual key being pressed
			pressedKeys.add(event.key);

			// Check if all keys in sequence are pressed
			const allPressed = sequence.every(key => pressedKeys.has(key));
			const exactMatch = pressedKeys.size === sequence.length;

			if (allPressed && exactMatch) {
				// Prevent default browser behavior
				event.preventDefault();
				event.stopPropagation();
				
				onTrigger();
			}
		},
		[sequence, onTrigger, enabled]
	);

	useEffect(() => {
		if (!enabled) return;

		window.addEventListener('keydown', handleKeyDown, true); // Use capture phase

		return () => {
			window.removeEventListener('keydown', handleKeyDown, true);
		};
	}, [handleKeyDown, enabled]);
}

