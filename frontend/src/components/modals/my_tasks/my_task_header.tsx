/**
 * COMPONENTS
 */

import StatusPill from '../../ui/status_pill';
import GalleryDisplay from '../../ui/gallery_display';

/**
 * HOOKS
 */

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../lib/contexts/AuthContext';

/**
 * SERVICES/HELPERS
 */

import { readTask } from '../../../lib/services/api/task';
import { formatDate } from '../../../lib/helpers/datehelpers';

/**
 * TYPES
 */

import { type Task } from '../../../lib/types/models';

export default function MyTaskModalHeader({
	taskId,
	modalTitle,
	children,
}: {
	taskId: number;
	modalTitle: string;
	children: React.ReactNode;
}) {
	const { token } = useAuthContext();
	const [task, setTask] = useState<Task | null>();

	/**
	 * INTERNAL FUNCTIONS
	 */

	useEffect(() => {
		async function start() {
			await fetchTaskInfo(taskId);
		}
		start();
	}, [taskId]);

	async function fetchTaskInfo(taskId: number) {
		const taskRow = await readTask(token!, taskId);
		console.log(taskRow);
		setTask(taskRow[0]);
	}

	/**
	 * Handlers
	 */

	return (
		<div className="flex flex-col gap-2 ml-5 pb-2 overflow-y-auto h-screen">
			{/* TITLE */}
			<div className="p-2">
				<p className="text-2xl">{modalTitle}</p>
				<div className="mt-3">
					<StatusPill text={task?.priority!}></StatusPill>
				</div>
			</div>
			{/* Information */}
			<div className="font-bold">Task Information</div>
			<div className="">
				<div className="flex">
					<div className="min-w-32">Task Name: </div>
					<div>{task?.name}</div>
				</div>
				<div className="flex">
					<div className="min-w-32">Task Descrption: </div>
					<div>{task?.description}</div>
				</div>
				<div className="flex">
					<div className="min-w-32">Created At: </div>
					<div>{formatDate(new Date(task?.createdAt!))}</div>
				</div>
				<div className="flex">
					<div className="min-w-32">Created By: </div>
					<div>{task?.createdByUser?.username}</div>
				</div>
				{task?.imagesAttachedToTasks &&
				task?.imagesAttachedToTasks.length > 0 ? (
					<div>
						<div className="min-w-32 mb-2">Attached Images: </div>
						<GalleryDisplay
							images={task?.imagesAttachedToTasks.map(
								(el) => el.image.imageUrl
							)}
						></GalleryDisplay>
					</div>
				) : (
					''
				)}
				<hr className="my-2" />
			</div>
			{children}
		</div>
	);
}
