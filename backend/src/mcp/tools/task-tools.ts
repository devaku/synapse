import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Zod schemas for validation
const createTaskSchema = z.object({
	name: z.string().describe('Task name/title'),
	description: z.string().describe('Detailed task description'),
	priority: z
		.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
		.default('MEDIUM')
		.describe('Task priority level'),
	taskVisibleToUsers: z
		.array(z.number())
		.optional()
		.describe('Array of user IDs who can see this task'),
	taskVisibleToTeams: z
		.array(z.number())
		.optional()
		.describe('Array of team IDs who can see this task'),
	taskHiddenFromUsers: z
		.array(z.number())
		.optional()
		.describe('Array of user IDs who cannot see this task'),
	startDate: z
		.string()
		.optional()
		.describe('Task start date (ISO 8601 format)'),
});

const readTasksSchema = z.object({
	taskId: z.number().optional().describe('Specific task ID to retrieve'),
	userOnly: z
		.boolean()
		.optional()
		.describe('Only return tasks visible to current user'),
	subscribedOnly: z
		.boolean()
		.optional()
		.describe('Only return tasks user is subscribed to'),
});

const updateTaskSchema = z.object({
	taskId: z.number().describe('ID of task to update'),
	name: z.string().optional().describe('Updated task name/title'),
	description: z.string().optional().describe('Updated task description'),
	priority: z
		.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
		.optional()
		.describe('Updated task priority'),
	taskVisibleToUsers: z
		.array(z.number())
		.optional()
		.describe('Updated array of user IDs who can see this task'),
	taskVisibleToTeams: z
		.array(z.number())
		.optional()
		.describe('Updated array of team IDs who can see this task'),
	taskHiddenFromUsers: z
		.array(z.number())
		.optional()
		.describe('Updated array of user IDs who cannot see this task'),
	startDate: z
		.string()
		.optional()
		.describe('Updated task start date (ISO 8601 format)'),
});

const subscribeTaskSchema = z.object({
	taskId: z.number().describe('ID of task to subscribe to'),
});

const unsubscribeTaskSchema = z.object({
	taskId: z.number().describe('ID of task to unsubscribe from'),
});

// Export Zod schemas for validation
export const TaskSchemas = {
	createTask: createTaskSchema,
	readTasks: readTasksSchema,
	updateTask: updateTaskSchema,
	subscribeTask: subscribeTaskSchema,
	unsubscribeTask: unsubscribeTaskSchema,
};

// Helper to get inline JSON Schema (without $ref)
function getInlineSchema(zodSchema: z.ZodType<any>) {
	const jsonSchema = zodToJsonSchema(zodSchema, { $refStrategy: 'none' });
	return jsonSchema;
}

// Export tool definitions with JSON Schema for MCP
export const TaskTools = {
	create_task: {
		name: 'create_task',
		description:
			'Create a new task in the task management system. Automatically subscribes the creator.',
		inputSchema: getInlineSchema(createTaskSchema),
	},

	read_tasks: {
		name: 'read_tasks',
		description:
			'Retrieve tasks. Can filter by ID, user visibility, or subscriptions.',
		inputSchema: getInlineSchema(readTasksSchema),
	},

	update_task: {
		name: 'update_task',
		description:
			'Update an existing task. Can modify task details and visibility rules.',
		inputSchema: getInlineSchema(updateTaskSchema),
	},

	subscribe_task: {
		name: 'subscribe_task',
		description: 'Subscribe the current user to a task to receive updates.',
		inputSchema: getInlineSchema(subscribeTaskSchema),
	},

	unsubscribe_task: {
		name: 'unsubscribe_task',
		description: 'Unsubscribe the current user from a task.',
		inputSchema: getInlineSchema(unsubscribeTaskSchema),
	},
};
