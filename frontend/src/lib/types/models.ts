// =======================
// User
// =======================
export interface User {
	id: number;
	keycloakId: string;
	username: string;
	email: string;
	firstName?: string | null;
	lastName?: string | null;
	phone?: number | null;
	lastActivity: Date;
	isDeleted: number;

	notification?: Notification[];
	logs?: Logs[];
	createdTasks?: Task[];
	comment?: Comment[];
	taskVisibleToUsers?: TaskVisibleToUsers[];
	taskHiddenFromUsers?: TaskHiddenFromUsers[];
	teamsUsersBelongTo?: TeamsUsersBelongTo[];
	taskUserSubscribedTo?: TaskUserSubscribeTo[];

	team?: Team[]; // Teams created by the user
	deletionRequest?: DeletionRequest[];
}

// =======================
// Task
// =======================
export interface Task {
	id: number;
	createdByUserId: number;
	createdByUser?: User;
	priority: string;
	name: string;
	description: string;
	image?: string | null;
	startDate?: Date | null;
	completeDate?: Date | null;
	createdAt: Date;
	isDeleted: number;
	isArchived: number;

	comments?: Comment[];
	taskVisibleToUsers?: TaskVisibleToUsers[];
	taskHiddenFromUsers?: TaskHiddenFromUsers[];
	taskVisibleToTeams?: TaskVisibleToTeams[];
	taskUserSubscribeTo?: TaskUserSubscribeTo[];
	deletionRequest?: DeletionRequest[];
}

// =======================
// Team
// =======================
export interface Team {
	id: number;
	name: string;
	description?: string | null;
	createdBy: number;
	createdByUser?: User;
	createdAt: Date;
	isDeleted: number;

	notifications?: Notification[];
	taskVisibleToTeams?: TaskVisibleToTeams[];
	teamsUsersBelongTo?: TeamsUsersBelongTo[];
}

// =======================
// Notification
// =======================
export interface Notification {
	id: number;
	name: string;
	description: string;
	userId: number;
	user?: User;
	teamId?: number | null;
	team?: Team | null;
	createdAt: Date;
	isDeleted: number;
}

// =======================
// Logs
// =======================
export interface Logs {
	id: number;
	name: string;
	description: string;
	userId: number;
	user?: User;
	createdAt: Date;
	isDeleted: number;
}

// =======================
// Comment
// =======================
export interface Comment {
	id: number;
	userId: number;
	user?: User;
	message: string;
	taskId: number;
	task?: Task;
	createdAt: Date;
	isDeleted: number;
}

// =======================
// Session
// =======================
export interface Session {
	sid: string;
	sess: any; // could be refined if you know the session structure
	expire: Date;
}

// =======================
// DeletionRequest
// =======================
export interface DeletionRequest {
	id: number;
	taskId: number;
	task?: Task;
	requestedByUserId: number;
	requestedByUser?: User;
	reason: string;
	createdAt: Date;
	isDeleted: number;
}

// =======================
// Link Tables
// =======================

export interface TeamsUsersBelongTo {
	userId: number;
	user?: User;
	teamId: number;
	team?: Team;
}

export interface TaskVisibleToUsers {
	taskId: number;
	task?: Task;
	userId: number;
	user?: User;
}

export interface TaskVisibleToTeams {
	taskId: number;
	task?: Task;
	teamId: number;
	team?: Team;
}

export interface TaskHiddenFromUsers {
	taskId: number;
	task?: Task;
	userId: number;
	user?: User;
}

export interface TaskUserSubscribeTo {
	taskId: number;
	task?: Task;
	userId: number;
	user?: User;
}
