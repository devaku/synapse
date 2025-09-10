import { useState } from 'react';
import SvgComponent from '../../components/ui/svg_component';
import Button from '../../components/ui/button';
import AuthContainer from '../../components/container/auth_container';

import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';

export default function RegisterPage() {
	const navigate = useNavigate();

	// const { loginSetCookies } = useMainAuthContext();

	// TODO: Switch this over to utilized React hook form
	// https://react-hook-form.com/

	const [first_name, setFirstName] = useState('');
	const [last_name, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	function handleFirstNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		setFirstName(e.target.value);
	}

	function handleLastNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		setLastName(e.target.value);
	}

	function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
		setEmail(e.target.value);
	}

	function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
		setPhone(e.target.value);
	}

	function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
		setUsername(e.target.value);
	}

	function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
		setPassword(e.target.value);
	}

	async function handleContinueClick() {
		// TODO: Create an error pop up
		try {
			// let response = await RegisterUser({
			// 	first_name: 'FIRST_NAME',
			// 	last_name: 'LAST_NAME',
			// 	email: 'email@email.com',
			// 	phone: '123456',
			// 	role: 'member',
			// 	username: 'username',
			// 	password: 'password',
			// });

			// let user_id = response.user_id;
			// let access_token = response.access;
			// let refresh_token = response.refresh;

			// // Set the cookies
			// loginSetCookies(user_id, access_token, refresh_token);

			// Redirect to dashboard
			navigate('/home');
		} catch (error) {
			alert(error);
		}
	}

	function handleCancelClick() {
		navigate('/');
	}

	return (
		<AuthContainer>
			{/* Register */}
			<div className=" flex flex-row items-center justify-center flex-1">
				{/* Form Input */}
				<div className="text-white w-1/2 flex flex-col gap-2">
					<div className="text-3xl font-bold text-center">
						Register
					</div>
					{/* First Name */}
					<div className="flex flex-row gap-2 border-b-2 border-b-white p-2">
						<SvgComponent
							iconName="email"
							className={'fill-white'}
						></SvgComponent>
						<input
							onChange={handleFirstNameChange}
							className="w-full bg-transparent outline-0"
							type="text"
							name="first_name"
							placeholder="First Name"
							id=""
						/>
					</div>
					{/* Last Name */}
					<div className="flex flex-row gap-2 border-b-2 border-b-white p-2">
						<SvgComponent
							iconName="email"
							className={'fill-white'}
						></SvgComponent>
						<input
							onChange={handleLastNameChange}
							className="w-full bg-transparent outline-0"
							type="text"
							name="last_name"
							placeholder="Last Name"
							id=""
						/>
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
					{/* Phone */}
					<div className="flex flex-row gap-2 border-b-2 border-b-white p-2">
						<SvgComponent
							iconName="email"
							className={'fill-white'}
						></SvgComponent>
						<input
							onChange={handlePhoneChange}
							className="w-full bg-transparent outline-0"
							type="tel"
							name="phone"
							placeholder="Phone"
							id=""
						/>
					</div>
					{/* Username */}
					<div className="flex flex-row gap-2 border-b-2 border-b-white p-2">
						<SvgComponent
							iconName="email"
							className={'fill-white'}
						></SvgComponent>
						<input
							onChange={handleUsernameChange}
							className="w-full bg-transparent outline-0"
							type="text"
							name="username"
							placeholder="Username"
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
							buttonText="Continue"
							buttonOnClick={handleContinueClick}
						></Button>
						<Button
							buttonType="purple"
							buttonText="Cancel"
							buttonOnClick={handleCancelClick}
						></Button>
					</div>
				</div>
			</div>
		</AuthContainer>
	);
}
