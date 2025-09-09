/* eslint-disable prettier/prettier */
import { useState } from 'react';
import SvgComponent from '../../components/ui/svg_component';
import AuthContainer from '../../components/container/auth_container';

import Button from '../../components/ui/button';
import DebugButton from '../../components/ui/debug_button';

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('');

	function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
		setEmail(e.target.value);
	}

	function handleContinueClick() {
		console.log('Continue Button Clicked');
		window.location.href = '/';
	}

	return (
		<AuthContainer>
			{/* Password Reset */}
			<div className="text-white flex flex-row items-center justify-center flex-1">
				{/* Form Input */}
				<div className="w-1/2 flex flex-col gap-2">
					<div className="text-3xl font-bold text-center mb-10">
						Password Reset
					</div>
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
					{/* Buttons */}
					<div className="flex flex-col gap-3 my-5">
						<Button
							buttonType="green"
							buttonText="Continue"
							buttonOnClick={handleContinueClick}
						></Button>
					</div>
					<div>
						<DebugButton />
					</div>
				</div>
			</div>
		</AuthContainer>
	);
}
