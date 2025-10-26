import { Request, Response } from 'express';
import { aiService } from '../services/ai-service';
import { TaskHandlers } from '../mcp/handlers/task-handlers';
import { TeamHandlers } from '../mcp/handlers/team-handlers';
import { CommentHandlers } from '../mcp/handlers/comment-handlers';

interface ChatRequest {
	messages: Array<{
		role: 'user' | 'assistant' | 'system';
		content: string;
	}>;
}

interface ToolExecutionRequest {
	toolCallId: string;
	tool: string;
	parameters: any;
}

/**
 * POST /api/v1/ai/chat
 * Chat with AI and get response with potential tool calls
 */
export const chatWithAI = async (req: Request, res: Response) => {
	try {
		const { messages } = req.body as ChatRequest;
		const userId = req.session.userData?.user.id;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Unauthorized',
			});
		}

		if (!messages || !Array.isArray(messages)) {
			return res.status(400).json({
				success: false,
				error: 'Messages array is required',
			});
		}

		const result = await aiService.chat(messages, userId);

		return res.json({
			success: true,
			data: result,
		});
	} catch (error: any) {
		console.error('Chat error:', error);
		return res.status(500).json({
			success: false,
			error: error.message || 'Failed to process chat request',
		});
	}
};

/**
 * POST /api/v1/ai/chat/stream
 * Stream chat response in real-time (SSE)
 */
export const streamChat = async (req: Request, res: Response) => {
	try {
		const { messages } = req.body as ChatRequest;
		const userId = req.session.userData?.user.id;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Unauthorized',
			});
		}

		// Set up SSE
		res.setHeader('Content-Type', 'text/event-stream');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Connection', 'keep-alive');
		res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

		const stream = aiService.chatStream(messages, userId);

		for await (const chunk of stream) {
			res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
		}

		res.write('data: [DONE]\n\n');
		res.end();
	} catch (error: any) {
		console.error('Stream error:', error);
		if (!res.headersSent) {
			res.status(500).json({
				success: false,
				error: 'Failed to stream chat',
			});
		}
	}
};

/**
 * POST /api/v1/ai/execute-tool
 * Execute an approved tool call
 */
export const executeToolCall = async (req: Request, res: Response) => {
	try {
		const { toolCallId, tool, parameters } =
			req.body as ToolExecutionRequest;
		const userId = req.session.userData?.user.id;

		if (!userId) {
			return res.status(401).json({
				success: false,
				error: 'Unauthorized',
			});
		}

		if (!tool || !parameters) {
			return res.status(400).json({
				success: false,
				error: 'Tool name and parameters are required',
			});
		}

		// Execute via MCP handlers
		let result;

		switch (tool) {
			// Task tools
			case 'create_task':
				result = await TaskHandlers.createTask(parameters, userId);
				break;
			case 'read_tasks':
				result = await TaskHandlers.readTasks(parameters, userId);
				break;
			case 'update_task':
				result = await TaskHandlers.updateTask(parameters, userId);
				break;
			case 'subscribe_task':
				result = await TaskHandlers.subscribeTask(parameters, userId);
				break;
			case 'unsubscribe_task':
				result = await TaskHandlers.unsubscribeTask(parameters, userId);
				break;
			case 'archive_task':
				result = await CommentHandlers.archiveTask(parameters, userId);
				break;

			// Team tools
			case 'create_team':
				result = await TeamHandlers.createTeam(parameters, userId);
				break;
			case 'list_teams':
				result = await TeamHandlers.listTeams(parameters, userId);
				break;
			case 'add_team_member':
				result = await TeamHandlers.addTeamMember(parameters, userId);
				break;
			case 'remove_team_member':
				result = await TeamHandlers.removeTeamMember(parameters, userId);
				break;

			// Comment tools
			case 'add_comment':
				result = await CommentHandlers.addComment(parameters, userId);
				break;
			case 'read_comments':
				result = await CommentHandlers.readComments(parameters, userId);
				break;

			default:
				return res.status(400).json({
					success: false,
					error: `Unknown tool: ${tool}`,
				});
		}

		return res.json({
			success: true,
			toolCallId,
			result,
		});
	} catch (error: any) {
		console.error('Tool execution error:', error);
		return res.status(500).json({
			success: false,
			error: error.message || 'Failed to execute tool',
		});
	}
};

/**
 * GET /api/v1/ai/health
 * Check if AI service is available
 */
export const checkHealth = async (req: Request, res: Response) => {
	try {
		const isHealthy = await aiService.healthCheck();

		return res.json({
			success: true,
			healthy: isHealthy,
			message: isHealthy
				? 'AI service is running'
				: 'AI service is unavailable',
		});
	} catch (error: any) {
		return res.status(503).json({
			success: false,
			healthy: false,
			error: error.message || 'AI service unavailable',
		});
	}
};
