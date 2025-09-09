import AuthContainer from '../../components/container/auth_container';
import Button from '../../components/ui/button';

export default function LoggedOutPage() {
	function handleContinueClick() {
		console.log('Continue Button Clicked');
		window.location.href = '/';
	}

	return (
		<AuthContainer>
			{/* Logged Out Page */}
			<div className="flex flex-col text-white items-center justify-center flex-1 w-full gap-2">
				{/* System Message */}
				<div className="text-3xl font-bold text-center">
					Successfully Logged Out
				</div>
				<div className="text-md text-center mt-12.5">
					You have been successfully logged out.
				</div>
				{/* Buttons */}
				<div className="flex flex-col gap-3 my-5 w-1/2 max-w-75">
					<Button
						buttonType="green"
						buttonText="Continue"
						buttonOnClick={handleContinueClick}
					></Button>
				</div>
			</div>
		</AuthContainer>
	);
}
