import { useEffect } from 'react';
import TTGLogo from '../../assets/images/ttglogo/TTG_Profile.png';

type commentCardProps = {
	profile_picture_url: string;
	name: string;
	comment: string;
	timestamp: string;
};

import { useState } from 'react';

export default function CommentCard({
	profile_picture_url,
	name,
	comment,
	timestamp,
}: commentCardProps) {
	let schema = {
		id: 'number',
	};

	useEffect(() => {}, []);
	return (
		<div>
			{/* Profile */}
			<div className="flex items-center gap-2">
				<div className="w-10 h-10">
					<img src={TTGLogo} alt="" srcSet="" />
				</div>
				<p>{name}</p>
			</div>
			<div>{comment}</div>
			<div>{timestamp}</div>
		</div>
	);
}
