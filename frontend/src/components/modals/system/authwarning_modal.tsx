import { useEffect, useState } from 'react';
import { useTimer } from '../../../lib/hooks/ui/useTimer';
import PopupModalContainer from '../../container/modal_containers/popup_modal_container';
export function AuthWarningModal({
	isOpen,
	futureTime,
	handleModalToggle,
}: {
	isOpen: boolean;
	futureTime: number;
	handleModalToggle: () => void;
}) {
	const [countdownTime, setCountdownTime] = useState('');
	const { isTimerRunning, startTimer, stopTimer } = useTimer(1000);

	useEffect(() => {
		if (isTimerRunning()) {
			handleStopTimer();
		}
	}, []);

	useEffect(() => {
		if (isOpen) {
			startTimer(() => {
				const readableFuture = new Date(futureTime);
				const readableLocal = new Date();

				const timeDifference =
					readableFuture.getTime() - readableLocal.getTime();
				const converted = new Date(timeDifference);

				const countdown = `${converted.getMinutes()}:${String(
					converted.getSeconds()
				).padStart(2, '0')}`;

				setCountdownTime(countdown);
			});
		}
	}, [isOpen]);

	function handleStopTimer() {
		setCountdownTime('');
		stopTimer();
	}

	return (
		<PopupModalContainer isOpen={isOpen}>
			<div className="h-full flex flex-col items-center justify-center w-full gap-2">
				<div>You have been idle for a while. Are you still there?</div>
				<div>{countdownTime}</div>
				<button
					className="bg-green-500 w-3xs p-2 cursor-pointer rounded"
					onClick={() => {
						handleStopTimer();
						handleModalToggle();
					}}
				>
					Yes
				</button>
			</div>
		</PopupModalContainer>
	);
}
