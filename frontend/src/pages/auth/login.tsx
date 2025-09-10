/* eslint-disable prettier/prettier */
import { useState } from 'react';
import SvgComponent from '../../components/ui/svg_component';

import AuthContainer from '../../components/container/auth_container';
// import { useGoogleAuthContext } from '../../lib/contexts/GoogleAuthContext';
import { useNavigate } from 'react-router';

// import { useMainAuthContext } from '../../lib/contexts/MainAuthContext';

import Button from '../../components/ui/button';

// import { LoginEmailPassword } from '../../lib/services/django/auth_api';
// import ErrorModal from '../../components/modals/generic/error_modal';
import PopupModalContainer from '../../components/container/modal_containers/popup_modal_container';

export default function LoginPage() {
	const navigate = useNavigate();
	// const { loginSetCookies } = useMainAuthContext();
	// const { googleLogin } = useGoogleAuthContext();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// States for Modal
	const [showModalError, setShowModalError] = useState(false);

	function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
		setEmail(e.target.value);
	}

	function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
		setPassword(e.target.value);
	}

	function handleModalDisplayCloseModalError() {
		setShowModalError(false);
	}

	async function handleLoginClick() {
		// TODO: Add an error popup

		try {
			// let response = await LoginEmailPassword(email, password);

			// let user_id = response.user_id;
			// let access_token = response.access;
			// let refresh_token = response.refresh;

			// Set the cookies
			// loginSetCookies(user_id, access_token, refresh_token);

			// Redirect to dashboard
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

	function handleFacebookClick() {}

	function handleGithubClick() {}

	function handleGoogleClick() {
		try {
			// googleLogin();
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<AuthContainer>
			{/* Login */}
			<div className="text-white flex flex-row items-center justify-center flex-1">
				{/* Form Input */}
				<div className="w-1/2 flex flex-col gap-2">
					<div className="text-3xl font-bold text-center">Login</div>
					{/* Email */}
					<div className="flex flex-row gap-2 border-b-2 border-b-white p-2">
						<SvgComponent
							iconName="email"
							className={'fill-white'}
						></SvgComponent>
						<input
							onChange={handleEmailChange}
							className="w-full bg-transparent outline-0"
							type="email"
							name="email"
							placeholder="Email"
							id=""
						/>
					</div>
					{/* Password */}
					<div className="flex flex-row gap-2 border-b-2 border-b-white p-2">
						<SvgComponent
							iconName="lock"
							className={'fill-white'}
						></SvgComponent>
						<input
							onChange={handlePasswordChange}
							className="w-full bg-transparent outline-0"
							type="password"
							name="password"
							placeholder="Password"
						/>
					</div>
					{/* Buttons */}
					<div className="flex flex-col gap-3 my-5">
						<Button
							buttonType="green"
							buttonText="Login"
							buttonOnClick={handleLoginClick}
						></Button>
						<Button
							buttonType="purple"
							buttonText="Register"
							buttonOnClick={handleRegisterClick}
						></Button>
					</div>

					{/* Forget Password */}
					<div>
						<p
							className="text-center cursor-pointer"
							onClick={handleForgetPasswordClick}
						>
							Forgot password?
						</p>
					</div>

					{/* Other ways to sign in */}
					<div className="flex flex-col items-center gap-3 mx-5">
						<p className="">Other ways to sign in</p>

						{/* Facebook */}
						<div
							onClick={handleGithubClick}
							className="flex flex-row gap-3 self-start cursor-pointer"
						>
							<SvgComponent
								iconName="facebook"
								className={'fill-white'}
							></SvgComponent>
							<p>Facebook</p>
						</div>
						{/* Github */}
						<div
							onClick={handleGithubClick}
							className="flex flex-row gap-3 self-start cursor-pointer"
						>
							<SvgComponent
								iconName="github"
								className={'fill-white'}
							></SvgComponent>
							<p>Github</p>
						</div>
						{/* Google */}
						<div
							onClick={handleGoogleClick}
							className="flex flex-row gap-3 self-start cursor-pointer"
						>
							<SvgComponent
								iconName="google"
								className={'fill-white'}
							></SvgComponent>

							<p>Google</p>
						</div>
					</div>
				</div>
			</div>
			<PopupModalContainer isOpen={showModalError}>
				<div>
					<button
						onClick={() => {
							// Close the modal
						}}
						className="bg-sky-500 p-2 rounded-2xl"
					>
						Close
					</button>
					<div>There is an error</div>
				</div>
			</PopupModalContainer>
		</AuthContainer>
	);
}
