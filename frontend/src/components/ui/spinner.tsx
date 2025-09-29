export default function Spinner() {
	return (
		<div className="h-dvh flex flex-col items-center justify-center">
			<div className="w-10 h-10">
				<div className="w-full h-full bg-sky-500 animate-spin"></div>
			</div>
		</div>
	);
}
