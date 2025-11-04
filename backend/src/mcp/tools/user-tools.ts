import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Zod schemas for validation
const listUsersSchema = z.object({
	search: z
		.string()
		.optional()
		.describe('Optional search term to filter users by username, firstName, lastName, or email'),
});

const findUserSchema = z.object({
	username: z
		.string()
		.optional()
		.describe('Username to search for'),
	email: z
		.string()
		.optional()
		.describe('Email to search for'),
	id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('User ID to search for'),
});

// Export Zod schemas for validation
export const UserSchemas = {
	listUsers: listUsersSchema,
	findUser: findUserSchema,
};

// Helper to get inline JSON Schema (without $ref)
function getInlineSchema(zodSchema: z.ZodType<any>) {
	const jsonSchema = zodToJsonSchema(zodSchema, { $refStrategy: 'none' });
	return jsonSchema;
}

// Export tool definitions with JSON Schema for MCP
export const UserTools = {
	list_users: {
		name: 'list_users',
		description:
			'List all users in the system. Returns id, username, firstName, lastName, and email for each user. Optionally filter by search term.',
		requiresConfirmation: false,
		inputSchema: getInlineSchema(listUsersSchema),
	},

	find_user: {
		name: 'find_user',
		description:
			'Find a specific user by username, email, or ID. Returns the user details including id which can be used for task assignment.',
		requiresConfirmation: false,
		inputSchema: getInlineSchema(findUserSchema),
	},
};
