#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { TaskTools, TaskSchemas } from './tools/task-tools.js';
import { TeamTools, TeamSchemas } from './tools/team-tools.js';
import { CommentTools, AdditionalTaskTools, CommentSchemas } from './tools/comment-tools.js';
import { TaskHandlers } from './handlers/task-handlers.js';
import { TeamHandlers } from './handlers/team-handlers.js';
import { CommentHandlers } from './handlers/comment-handlers.js';

// Default user ID - you can override with environment variable
const DEFAULT_USER_ID = 1;

class TaskMCPServer {
	private server: Server;
	private userId: number;

	constructor(userId: number) {
		this.userId = userId;

		this.server = new Server(
			{
				name: 'synapse-task-manager',
				version: '1.0.0',
			},
			{
				capabilities: {
					tools: {},
				},
			}
		);

		this.setupHandlers();
	}

	private setupHandlers() {
		// List available tools
		this.server.setRequestHandler(ListToolsRequestSchema, async () => {
			const allTools = [
				...Object.values(TaskTools),
				...Object.values(TeamTools),
				...Object.values(CommentTools),
				...Object.values(AdditionalTaskTools),
			];
			
			return {
				tools: allTools.map((tool) => ({
					name: tool.name,
					description: tool.description,
					inputSchema: tool.inputSchema,
				})),
			};
		});

		// Handle tool calls
		this.server.setRequestHandler(
			CallToolRequestSchema,
			async (request) => {
				const { name, arguments: args } = request.params;

				try {
					// Validate input with Zod schemas
					let validatedArgs;
					switch (name) {
						// Task tools
						case 'create_task':
							validatedArgs = TaskSchemas.createTask.parse(args);
							break;
						case 'read_tasks':
							validatedArgs = TaskSchemas.readTasks.parse(args);
							break;
						case 'update_task':
							validatedArgs = TaskSchemas.updateTask.parse(args);
							break;
						case 'subscribe_task':
							validatedArgs = TaskSchemas.subscribeTask.parse(args);
							break;
						case 'unsubscribe_task':
							validatedArgs = TaskSchemas.unsubscribeTask.parse(args);
							break;
						
						// Team tools
						case 'create_team':
							validatedArgs = TeamSchemas.createTeam.parse(args);
							break;
						case 'list_teams':
							validatedArgs = TeamSchemas.listTeams.parse(args);
							break;
						case 'add_team_member':
							validatedArgs = TeamSchemas.addTeamMember.parse(args);
							break;
						case 'remove_team_member':
							validatedArgs = TeamSchemas.removeTeamMember.parse(args);
							break;
						
						// Comment and additional tools
						case 'add_comment':
							validatedArgs = CommentSchemas.addComment.parse(args);
							break;
						case 'read_comments':
							validatedArgs = CommentSchemas.readComments.parse(args);
							break;
						case 'archive_task':
							validatedArgs = CommentSchemas.archiveTask.parse(args);
							break;
						
						default:
							throw new Error(`Unknown tool: ${name}`);
					}

					// Execute tool with validated arguments
					let result;
					switch (name) {
						// Task handlers
						case 'create_task':
							result = await TaskHandlers.createTask(
								validatedArgs,
								this.userId
							);
							break;
						case 'read_tasks':
							result = await TaskHandlers.readTasks(
								validatedArgs,
								this.userId
							);
							break;
						case 'update_task':
							result = await TaskHandlers.updateTask(
								validatedArgs,
								this.userId
							);
							break;
						case 'subscribe_task':
							result = await TaskHandlers.subscribeTask(
								validatedArgs,
								this.userId
							);
							break;
						case 'unsubscribe_task':
							result = await TaskHandlers.unsubscribeTask(
								validatedArgs,
								this.userId
							);
							break;

						// Team handlers
						case 'create_team':
							result = await TeamHandlers.createTeam(
								validatedArgs,
								this.userId
							);
							break;
						case 'list_teams':
							result = await TeamHandlers.listTeams(
								validatedArgs,
								this.userId
							);
							break;
						case 'add_team_member':
							result = await TeamHandlers.addTeamMember(
								validatedArgs,
								this.userId
							);
							break;
						case 'remove_team_member':
							result = await TeamHandlers.removeTeamMember(
								validatedArgs,
								this.userId
							);
							break;

						// Comment and additional handlers
						case 'add_comment':
							result = await CommentHandlers.addComment(
								validatedArgs,
								this.userId
							);
							break;
						case 'read_comments':
							result = await CommentHandlers.readComments(
								validatedArgs,
								this.userId
							);
							break;
						case 'archive_task':
							result = await CommentHandlers.archiveTask(
								validatedArgs,
								this.userId
							);
							break;

						default:
							throw new Error(`Unknown tool: ${name}`);
					}

					return {
						content: [
							{
								type: 'text',
								text: JSON.stringify(result, null, 2),
							},
						],
					};
				} catch (error: any) {
					return {
						content: [
							{
								type: 'text',
								text: JSON.stringify(
									{
										success: false,
										error: error.message,
										stack: error.stack,
									},
									null,
									2
								),
							},
						],
						isError: true,
					};
				}
			}
		);
	}

	async start() {
		const transport = new StdioServerTransport();
		await this.server.connect(transport);

		// Use stderr for logging so it doesn't interfere with stdio protocol
		console.error('Synapse Task Manager MCP Server started');
		console.error(`User ID: ${this.userId}`);
	}
}

// Start server
const userId = process.env.MCP_USER_ID
	? parseInt(process.env.MCP_USER_ID)
	: DEFAULT_USER_ID;

const server = new TaskMCPServer(userId);
server.start().catch((error) => {
	console.error('Failed to start MCP server:', error);
	process.exit(1);
});
