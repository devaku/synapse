import { useEffect } from 'react';
import TTGLogo from '../../assets/images/ttglogo/TTG_Profile.png';
import GalleryDisplay from './gallery_display';

type commentCardProps = {
	profile_picture_url: string | undefined;
	name: string;
	comment: string;
	images: string[];
	timestamp: string;
};

export default function CommentCard({
	profile_picture_url,
	name,
	comment,
	images,
	timestamp,
}: commentCardProps) {
	useEffect(() => {}, []);
	return (
		<div className="my-2">
			{/* Profile */}
			<div className="flex items-center gap-2">
				<div className="w-10 h-10">
					<img
						className="rounded-2xl"
						src={profile_picture_url}
						alt=""
						srcSet=""
					/>
				</div>
				<p>{name}</p>
			</div>

			<div>{comment}</div>
			<div>
				{images.length > 0 ? <div>Attached Images: </div> : ''}
				<GalleryDisplay images={images}></GalleryDisplay>
			</div>
			<div>{timestamp}</div>
			<hr className="my-2" />
		</div>
	);
}
