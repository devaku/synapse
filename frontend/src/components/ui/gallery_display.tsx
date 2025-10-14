/**
 * HOOKS
 */

import { useState, useEffect } from 'react';

/**
 * COMPONENTS
 */

import { PhotoProvider, PhotoView } from 'react-photo-view';

export default function GalleryDisplay({ images }: { images?: string[] }) {
	return (
		<>
			<div className="grid grid-cols-4 gap-2 px-2">
				<PhotoProvider>
					{images?.map((el, index) => {
						return (
							<PhotoView key={index} src={el}>
								<img className="w-full" src={el} alt="" />
							</PhotoView>
						);
					})}
				</PhotoProvider>
			</div>
		</>
	);
}
