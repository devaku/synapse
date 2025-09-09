export default function DebugButton() {
	return (
		<div>
			<button
				className="bg-gray-100 border-1 border-black p-2 text-black"
				onClick={() => {
					window.location.href = '/debug';
				}}
			>
				Debug Page
			</button>
		</div>
	);
}
