import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Zod schemas for validation
const addCommentSchema = z.object({
	taskId: z.number().int().positive().describe('ID of the task to comment on'),
	message: z
		.string()
		.min(1)
		.max(255)
		.describe('Comment text'),
});

const readCommentsSchema = z.object({
	taskId: z.number().int().positive().describe('ID of task to get comments for'),
	limit: z.number().int().positive().optional().describe('Maximum number of comments to retrieve'),
});

const archiveTaskSchema = z.object({
	taskId: z.number().int().positive().describe('ID of task to archive'),
});

// Export Zod schemas for validation
export const CommentSchemas = {
	addComment: addCommentSchema,
	readComments: readCommentsSchema,
	archiveTask: archiveTaskSchema,
};

// Helper to get inline JSON Schema (without $ref)
function getInlineSchema(zodSchema: z.ZodType<any>) {
	const jsonSchema = zodToJsonSchema(zodSchema, { $refStrategy: 'none' });
	return jsonSchema;
}

// Export tool definitions with JSON Schema for MCP
export const CommentTools = {
	add_comment: {
		name: 'add_comment',
		description:
			'Add a comment to a task. Useful for discussions and updates.',
		requiresConfirmation: false,
		inputSchema: getInlineSchema(addCommentSchema),
	},

	read_comments: {
		name: 'read_comments',
		description: 'Retrieve comments for a specific task.',
		requiresConfirmation: false,
		inputSchema: getInlineSchema(readCommentsSchema),
	},
};

export const AdditionalTaskTools = {
	archive_task: {
		name: 'archive_task',
		description:
			'Archive a task. Archived tasks are hidden from default views but not deleted.',
		requiresConfirmation: true,
		inputSchema: getInlineSchema(archiveTaskSchema),
	},
};
