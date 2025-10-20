import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { TaskTools } from './tools/task-tools.js';
import { TaskHandlers } from './handlers/task-handlers.js';

export class TaskMCPServer {
	private server: Server;
	private userId: number; // Set this based on authentication

	constructor(userId: number) {
		this.userId = userId;
		this.server = new Server(
			{
				name: 'task-manager-mcp',
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
			return {
				tools: Object.values(TaskTools).map((tool) => ({
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
					let result;

					switch (name) {
						case 'create_task':
							result = await TaskHandlers.createTask(
								args,
								this.userId
							);
							break;

						case 'read_tasks':
							result = await TaskHandlers.readTasks(
								args,
								this.userId
							);
							break;

						case 'update_task':
							result = await TaskHandlers.updateTask(
								args,
								this.userId
							);
							break;

						case 'subscribe_task':
							result = await TaskHandlers.subscribeTask(
								args,
								this.userId
							);
							break;

						case 'unsubscribe_task':
							result = await TaskHandlers.unsubscribeTask(
								args,
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
								text: JSON.stringify({
									success: false,
									error: error.message,
								}),
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
		console.error('Task Manager MCP Server running on stdio');
	}
}

// Start server
// You'll need to pass userId from authentication
const userId = parseInt(process.env.USER_ID || '1');
const server = new TaskMCPServer(userId);
server.start().catch(console.error);
