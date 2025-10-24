import { useRef } from 'react';

type typeUseTimer = {
	timerTick: number;
};

export function useTimer(timerTick: number) {
	const timerRef = useRef<NodeJS.Timeout>(null);
	function startTimer(intervalFunction: () => void) {
		console.log('TIMER STARTING');
		timerRef.current = setInterval(intervalFunction, timerTick);
	}

	function stopTimer() {
		console.log('TIMER STOPPING');
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	}

	function isTimerRunning() {
		if (timerRef.current) {
			return true;
		} else {
			return false;
		}
	}

	return { startTimer, stopTimer, isTimerRunning };
}
