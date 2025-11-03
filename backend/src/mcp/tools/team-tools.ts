import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Zod schemas for validation
const createTeamSchema = z.object({
	name: z
		.string()
		.min(1)
		.max(255)
		.describe('Team name'),
	description: z
		.string()
		.max(255)
		.optional()
		.describe('Team description'),
	memberIds: z
		.array(z.number().int().positive())
		.optional()
		.describe('Array of user IDs to add as team members. Creator is automatically included.'),
});

const listTeamsSchema = z.object({
	includeMembers: z
		.boolean()
		.default(true)
		.describe('Whether to include team member details'),
	search: z
		.string()
		.optional()
		.describe('Optional search term to filter teams by name or description'),
});

const findTeamSchema = z.object({
	name: z
		.string()
		.optional()
		.describe('Team name to search for'),
	id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Team ID to search for'),
});

const addTeamMemberSchema = z.object({
	teamId: z.number().int().positive().describe('ID of team'),
	userIds: z
		.array(z.number().int().positive())
		.describe('Array of user IDs to add to team'),
});

const removeTeamMemberSchema = z.object({
	teamId: z.number().int().positive().describe('ID of team'),
	userIds: z
		.array(z.number().int().positive())
		.describe('Array of user IDs to remove from team'),
});

// Export Zod schemas for validation
export const TeamSchemas = {
	createTeam: createTeamSchema,
	listTeams: listTeamsSchema,
	findTeam: findTeamSchema,
	addTeamMember: addTeamMemberSchema,
	removeTeamMember: removeTeamMemberSchema,
};

// Helper to get inline JSON Schema (without $ref)
function getInlineSchema(zodSchema: z.ZodType<any>) {
	const jsonSchema = zodToJsonSchema(zodSchema, { $refStrategy: 'none' });
	return jsonSchema;
}

// Export tool definitions with JSON Schema for MCP
export const TeamTools = {
	create_team: {
		name: 'create_team',
		description:
			'Create a new team with optional initial members. The creator is automatically added to the team.',
		requiresConfirmation: true,
		inputSchema: getInlineSchema(createTeamSchema),
	},

	list_teams: {
		name: 'list_teams',
		description:
			'Retrieve all teams in the system with their members. Optionally filter by search term.',
		requiresConfirmation: false,
		inputSchema: getInlineSchema(listTeamsSchema),
	},

	find_team: {
		name: 'find_team',
		description:
			'Find a specific team by name or ID. Returns team details including id which can be used for task assignment.',
		requiresConfirmation: false,
		inputSchema: getInlineSchema(findTeamSchema),
	},

	add_team_member: {
		name: 'add_team_member',
		description: 'Add one or more users to a team.',
		requiresConfirmation: true,
		inputSchema: getInlineSchema(addTeamMemberSchema),
	},

	remove_team_member: {
		name: 'remove_team_member',
		description: 'Remove one or more users from a team.',
		requiresConfirmation: true,
		inputSchema: getInlineSchema(removeTeamMemberSchema),
	},
};
