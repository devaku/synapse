import TTGLogo from '../../assets/images/ttglogo/TTG_Spiral_Logo_White.png';

export default function AuthContainer({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-row bg-ttg-dark-blue px-5 h-screen exclude-dark">
			{/* Login */}
			<div className="flex flex-row items-center justify-center flex-1 w-1/2">
				{children}
			</div>
			{/* Image */}
			<div className="flex flex-row items-center justify-center w-1/2">
				<div className="w-11/12 text-white text-center">
					<img src={TTGLogo} alt="TTG Logo" className="w-full" />
				</div>
			</div>
		</div>
	);
}
