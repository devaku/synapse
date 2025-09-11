// profile_page.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import HeaderContainer from '../../components/container/header_container';
import SvgComponent from '../../components/ui/svg_component';

type EditProfileFormProps = {
	fullName: string;
	email: string;
	phoneNumber: string;
	setFullName: (v: string) => void;
	setEmail: (v: string) => void;
	setPhoneNumber: (v: string) => void;
	onSave: () => void;
	onCancel: () => void;
};

function EditProfileForm({
	fullName,
	email,
	phoneNumber,
	setFullName,
	setEmail,
	setPhoneNumber,
	onSave,
	onCancel,
}: EditProfileFormProps) {
	return (
		<div className="mt-8 md:mt-0 bg-[#153243]/90 backdrop-blur-sm p-6 w-[300px] text-white shadow-lg">
			<h3 className="text-lg mb-4 text-center">Edit Profile</h3>
			<div className="space-y-2">
				<input
					type="text"
					value={fullName}
					onChange={(e) => setFullName(e.target.value)}
					className="w-full p-2 text-black bg-white"
					placeholder="Full Name"
				/>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full p-2 text-black bg-white"
					placeholder="Email"
				/>
				<input
					type="tel"
					value={phoneNumber}
					onChange={(e) => setPhoneNumber(e.target.value)}
					className="w-full p-2 text-black bg-white"
					placeholder="Phone Number"
				/>
			</div>
			<div className="flex space-x-2 mt-4">
				<button
					type="button"
					className="flex-1 py-2 bg-green-600 text-white"
					onClick={onSave}
				>
					Save
				</button>
				<button
					type="button"
					className="flex-1 py-2 bg-gray-600 text-white"
					onClick={onCancel}
				>
					Cancel
				</button>
			</div>
		</div>
	);
}

export default function ProfilePage() {
	const navigate = useNavigate();

	// Profile state
	const [showEditPopup, setShowEditPopup] = useState(false);
	const [fullName, setFullName] = useState('John Tartigrade Doe');
	const [email, setEmail] = useState('johndoe@email.com');
	const [phoneNumber, setPhoneNumber] = useState('1-(368)-123-4567');

	// Save handler
	const handleSave = () => {
		setShowEditPopup(false);
	};

	return (
		<HeaderContainer pageTitle="Profile">
			<div className="flex flex-col items-center justify-center py-12">
				<div className="flex flex-col md:flex-row md:space-x-8 items-start">
					{/* Profile section */}
					<div className="flex flex-col items-center">
						<div className="w-[140px] h-[140px] flex items-center justify-center">
							<SvgComponent
								iconName="PROFILE"
								className="fill-white w-32 h-32"
							/>
						</div>

						<div className="mt-8 text-center space-y-1">
							<h2 className="text-xl">{fullName}</h2>
							<p className="text-xl">{email}</p>
							<p className="text-xl">{phoneNumber}</p>
						</div>

						<div className="mt-12 space-y-4 w-[220px]">
							<button
								type="button"
								className="w-full h-[35px] px-4 py-1 text-white bg-[#153243]"
								onClick={() => setShowEditPopup(true)}
							>
								Edit Profile
							</button>
							<button
								type="button"
								className="w-full h-[35px] px-4 py-1 text-white bg-[#153243]"
								onClick={() => navigate('/')}
							>
								Logout
							</button>
						</div>
					</div>

					{/* Edit popup */}
					{showEditPopup && (
						<EditProfileForm
							fullName={fullName}
							email={email}
							phoneNumber={phoneNumber}
							setFullName={setFullName}
							setEmail={setEmail}
							setPhoneNumber={setPhoneNumber}
							onSave={handleSave}
							onCancel={() => setShowEditPopup(false)}
						/>
					)}
				</div>
			</div>
		</HeaderContainer>
	);
}
