import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import HeaderContainer from '../components/container/header_container';
import SvgComponent from '../components/ui/svg_component';

export default function ProfilePage() {
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Profile state
	const [isEditing, setIsEditing] = useState(false);
	const [fullName, setFullName] = useState('John Tartigrade Doe');
	const [email, setEmail] = useState('johndoe@email.com');
	const [phoneNumber, setPhoneNumber] = useState('1-(368)-123-4567');
	const [profileImage, setProfileImage] = useState<string | null>(null);

	// Temporary editing state
	const [editFullName, setEditFullName] = useState(fullName);
	const [editEmail, setEditEmail] = useState(email);
	const [editPhoneNumber, setEditPhoneNumber] = useState(phoneNumber);
	const [editProfileImage, setEditProfileImage] = useState<string | null>(
		profileImage
	);

	// Handle image upload - Used AI : prompt = "How do I use a hidden file input with useRef and FileReader in React so that when a user clicks
	// an 'Upload Photo' button, they can pick an image and it gets displayed as their temporary profile picture?"
	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result as string;
				setEditProfileImage(result);
			};
			reader.readAsDataURL(file);
		}
	};

	// Trigger file input click
	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	// Start editing
	const handleEdit = () => {
		setEditFullName(fullName);
		setEditEmail(email);
		setEditPhoneNumber(phoneNumber);
		setEditProfileImage(profileImage);
		setIsEditing(true);
	};

	// Save handler
	const handleSave = () => {
		setFullName(editFullName);
		setEmail(editEmail);
		setPhoneNumber(editPhoneNumber);
		setProfileImage(editProfileImage);
		setIsEditing(false);
	};

	// Cancel handler
	const handleCancel = () => {
		setIsEditing(false);
	};

	return (
		<HeaderContainer pageTitle="Profile">
			<div className="flex justify-center py-12">
				<div className="flex flex-col items-center max-w-md w-full">
					{/* Profile Picture */}
					<div className="w-[140px] h-[140px] flex items-center justify-center mb-2">
						{(isEditing ? editProfileImage : profileImage) ? (
							<img
								src={
									isEditing
										? editProfileImage!
										: profileImage!
								}
								alt="Profile"
								className="w-32 h-32 rounded-full object-cover"
							/>
						) : (
							<SvgComponent
								iconName="PROFILE"
								className="fill-white w-32 h-32"
							/>
						)}
					</div>

					{/* Upload Picture Link */}
					{isEditing && (
						<>
							<button
								type="button"
								onClick={handleUploadClick}
								className="text-sm text-black underline mb-6 hover:text-blue-300"
							>
								Upload Picture
							</button>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleImageUpload}
								className="hidden"
							/>
						</>
					)}

					{!isEditing && <div className="mb-6"></div>}

					{/* Profile Information */}
					{isEditing ? (
						<div className="w-full max-w-sm space-y-4 -ml-20">
							<div className="flex items-center space-x-3">
								<label className="w-16 text-right text-sm">
									Name:
								</label>
								<input
									type="text"
									value={editFullName}
									onChange={(e) =>
										setEditFullName(e.target.value)
									}
									className="flex-1 px-3 py-2 text-black bg-white border border-gray-300 text-center"
								/>
							</div>

							<div className="flex items-center space-x-3">
								<label className="w-16 text-right text-sm">
									Email:
								</label>
								<input
									type="email"
									value={editEmail}
									onChange={(e) =>
										setEditEmail(e.target.value)
									}
									className="flex-1 px-3 py-2 text-black bg-white border border-gray-300 text-center"
								/>
							</div>

							<div className="flex items-center space-x-3">
								<label className="w-16 text-right text-sm">
									Phone:
								</label>
								<input
									type="tel"
									value={editPhoneNumber}
									onChange={(e) =>
										setEditPhoneNumber(e.target.value)
									}
									className="flex-1 px-3 py-2 text-black bg-white border border-gray-300 text-center"
								/>
							</div>
						</div>
					) : (
						// View Mode
						<div className="text-center space-y-1">
							<h2 className="text-xl">{fullName}</h2>
							<p className="text-xl">{email}</p>
							<p className="text-xl">{phoneNumber}</p>
						</div>
					)}

					{/* Action Buttons */}
					<div className="mt-12 w-full max-w-[220px]">
						{isEditing ? (
							<button
								type="button"
								className="w-full h-[35px] px-4 py-1 text-white bg-[#153243]"
								onClick={handleSave}
							>
								Save Profile
							</button>
						) : (
							<div className="space-y-4">
								<button
									type="button"
									className="w-full h-[35px] px-4 py-1 text-white bg-[#153243]"
									onClick={handleEdit}
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
						)}
					</div>
				</div>
			</div>
		</HeaderContainer>
	);
}
