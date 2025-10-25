import AuthContainer from '../../components/container/auth_container';
import { useNavigate } from 'react-router';

import Button from '../../components/ui/button';

export default function LoginPage() {
	const navigate = useNavigate();

	/**
	 * TODO: If user is logged in, redirect
	 */

	async function handleLoginClick() {
		try {
			navigate('/home');
		} catch (error) {
			alert(error);
		}
	}

	function handleRegisterClick() {
		navigate('/register');
	}

	function handleForgetPasswordClick() {
		navigate('/forgot_password');
	}

	return (
		<AuthContainer>
			{/* Login */}
			<div className="text-white flex flex-row items-center justify-center flex-1">
				{/* Form Input */}
				<div className="w-1/2 flex flex-col gap-2">
					<div className="text-3xl font-bold text-center">Login</div>

					{/* Buttons */}
					<div className="flex flex-col gap-3 my-5">
						<Button
							type="Primary"
							text="Login"
							onClick={handleLoginClick}
						></Button>
						<Button
							type="Secondary"
							text="Register"
							onClick={handleLoginClick}
						></Button>
					</div>
				</div>
			</div>
		</AuthContainer>
	);
}
