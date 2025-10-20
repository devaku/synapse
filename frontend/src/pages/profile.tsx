import { useNavigate } from 'react-router';
import { useAuthContext } from '../lib/contexts/AuthContext';
import HeaderContainer from '../components/container/header_container';
import SvgComponent from '../components/ui/svg_component';

export default function ProfilePage() {
	const navigate = useNavigate();
	const { serverData } = useAuthContext();

	// Get user info from serverData
	const fullName =
		serverData?.firstName && serverData?.lastName
			? `${serverData.firstName} ${serverData.lastName}`
			: 'Name - Not available';
	const email = serverData?.email || 'Email - Not available';
	// Will come back to updating this
	const phoneNumber = serverData?.phoneNumber || 'Phone - Not available';
	const profileImage = serverData?.image?.imageUrl || null;

	return (
		<HeaderContainer pageTitle="Profile">
			<div className="flex justify-center py-12">
				<div className="flex flex-col items-center max-w-md w-full">
					{/* Profile Picture */}
					<div className="w-[140px] h-[140px] flex items-center justify-center mb-2">
						{profileImage ? (
							<img
								src={profileImage}
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

					<div className="mb-6"></div>

					{/* Profile Information */}
					<div className="text-center space-y-1">
						<h2 className="text-xl">{fullName}</h2>
						<p className="text-xl">{email}</p>
						<p className="text-xl">{phoneNumber}</p>
					</div>

					{/* Action Buttons */}
					<div className="mt-12 w-full max-w-[220px]">
						<div className="space-y-4">
							<button
								type="button"
								className="w-full h-[35px] px-4 py-1 text-white bg-[#153243]"
								onClick={() => navigate('/')}
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</div>
		</HeaderContainer>
	);
}