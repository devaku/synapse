export interface User {
	id: number;
	keycloakId: string;
	username: string;
	email: string;
	firstName?: string | null;
	lastName?: string | null;
	phone?: number | null;
	imageId?: number | null;
	lastActivity: Date;
	isDeleted: number;

	image?: Image | null;
	notification: Notification[];
	logs: Logs[];
	createdTasks: Task[];
	comment: Comment[];
	taskVisibleToUsers: TaskVisibleToUsers[];
	taskHiddenFromUsers: TaskHiddenFromUsers[];
	teamsUsersBelongTo: TeamsUsersBelongTo[];
	team: Team[];
	deletionRequest: DeletionRequest[];
	taskUsersSubscribeTo: TaskUserSubscribeTo[];
	taskArchived: Task[];
	repoCollaboratorRequests: RepoColaboratorRequest[];
	imagesUploaded: Image[];
}

export interface Task {
	id: number;
	createdByUserId: number;
	priority: string;
	name: string;
	description: string;

	startDate?: Date | null;
	createdAt: Date;
	isDeleted: number;
	completeDate?: Date | null;
	isArchived: number;
	archivedByUserId?: number | null;

	createdByUser: User;
	archivedByUser?: User | null;
	comments: Comment[];
	imagesAttachedToTasks: ImagesAttachedToTasks[];
	taskVisibleToUsers: TaskVisibleToUsers[];
	taskHiddenFromUsers: TaskHiddenFromUsers[];
	taskVisibleToTeams: TaskVisibleToTeams[];
	deletionRequest: DeletionRequest[];
	taskUserSubscribeTo: TaskUserSubscribeTo[];
}

export interface Team {
	id: number;
	name: string;
	description?: string | null;
	createdBy: number;
	createdAt: Date;
	isDeleted: number;

	createdByUser: User;
	notifications: Notification[];
	taskVisibleToTeams: TaskVisibleToTeams[];
	teamsUsersBelongTo: TeamsUsersBelongTo[];
}

export interface Notification {
	id: number;
	name: string;
	description: string;
	userId: number;
	teamId?: number | null;
	createdAt: Date;
	isDeleted: number;

	user: User;
	team?: Team | null;
}

export interface Logs {
	id: number;
	name: string;
	description: string;
	userId: number;
	createdAt: Date;
	isDeleted: number;

	user: User;
}

export interface Comment {
	id: number;
	userId: number;
	taskId: number;
	message: string;
	createdAt: Date;
	isDeleted: number;

	user: User;
	task: Task;
	imagesAttachedToComments: ImagesAttachedToComments[];
}

export interface Session {
	sid: string;
	sess: any; // JSON object
	expire: Date;
}

export interface DeletionRequest {
	id: number;
	taskId: number;
	requestedByUserId: number;
	reason: string;
	createdAt: Date;
	isDeleted: number;

	task: Task;
	requestedByUser: User;
}

export interface RepoColaboratorRequest {
	id: number;
	githubUsername: string;
	userId: number;
	repoId: number;
	permission: string;
	createdAt: Date;

	user: User;
}

export interface Image {
	id: number;
	imageUrl: string;
	userId: number;
	createdAt: Date;

	uploadedBy: User;
	imagesAttachedToComments: ImagesAttachedToComments[];
	usersUsingAsProfileImage: User[];
}

/**
 * Link Tables
 */

export interface ImagesAttachedToTasks {
	imageId: number;
	taskId: number;

	image: Image;
	task: Task;
}

export interface ImagesAttachedToComments {
	imageId: number;
	commentId: number;

	image: Image;
	comment: Comment;
}

export interface TaskUserSubscribeTo {
	userId: number;
	taskId: number;

	user: User;
	task: Task;
}

export interface TeamsUsersBelongTo {
	userId: number;
	teamId: number;

	user: User;
	team: Team;
}

export interface TaskVisibleToUsers {
	userId: number;
	taskId: number;

	user: User;
	task: Task;
}

export interface TaskVisibleToTeams {
	teamId: number;
	taskId: number;

	team: Team;
	task: Task;
}

export interface TaskHiddenFromUsers {
	userId: number;
	taskId: number;

	user: User;
	task: Task;
}
