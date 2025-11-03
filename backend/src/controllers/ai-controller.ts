import { Request, Response } from 'express';
import { aiService } from '../services/ai-service';
import { TaskHandlers } from '../mcp/handlers/task-handlers';
import { TeamHandlers } from '../mcp/handlers/team-handlers';
import { CommentHandlers } from '../mcp/handlers/comment-handlers';
import { UserHandlers } from '../mcp/handlers/user-handlers';

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

		console.log('[AI Controller] Chat request received');
		console.log('[AI Controller] User ID:', userId);
		console.log('[AI Controller] Messages:', JSON.stringify(messages, null, 2));

		if (!userId) {
			console.error('[AI Controller] Unauthorized: No user ID in session');
			return res.status(401).json({
				success: false,
				error: 'Unauthorized',
			});
		}

		if (!messages || !Array.isArray(messages)) {
			console.error('[AI Controller] Invalid request: Messages not provided or not an array');
			return res.status(400).json({
				success: false,
				error: 'Messages array is required',
			});
		}

		const result = await aiService.chat(messages, userId);
		
		console.log('[AI Controller] Chat completed successfully');
		console.log('[AI Controller] Result structure:', JSON.stringify({
			hasResponse: !!result.response,
			hasToolCall: !!result.toolCall,
			responseLength: result.response?.length || 0,
		}, null, 2));
		console.log('[AI Controller] Full result:', JSON.stringify(result, null, 2));
		
		return res.json({
			success: true,
			data: result,
		});
	} catch (error: any) {
		console.error('=== AI CONTROLLER CHAT ERROR ===');
		console.error('Error type:', error.constructor.name);
		console.error('Error message:', error.message);
		console.error('Error stack:', error.stack);
		
		return res.status(500).json({
			success: false,
			error: error.message || 'Failed to process chat request',
			details: process.env.NODE_ENV === 'DEVELOPMENT' ? {
				type: error.constructor.name,
				stack: error.stack,
			} : undefined,
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

		console.log('[AI Controller] Stream request received');
		console.log('[AI Controller] User ID:', userId);

		if (!userId) {
			console.error('[AI Controller] Stream: Unauthorized - no user ID');
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

		console.log('[AI Controller] SSE headers set, starting stream...');

		const stream = aiService.chatStream(messages, userId);

		for await (const chunk of stream) {
			res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
		}

		res.write('data: [DONE]\n\n');
		res.end();
		
		console.log('[AI Controller] Stream completed successfully');
	} catch (error: any) {
		console.error('=== AI CONTROLLER STREAM ERROR ===');
		console.error('Error type:', error.constructor.name);
		console.error('Error message:', error.message);
		console.error('Error stack:', error.stack);
		
		if (!res.headersSent) {
			res.status(500).json({
				success: false,
				error: error.message || 'Failed to stream chat',
				details: process.env.NODE_ENV === 'DEVELOPMENT' ? {
					type: error.constructor.name,
					stack: error.stack,
				} : undefined,
			});
		} else {
			// Send error via SSE if headers already sent
			res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
			res.end();
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
			case 'find_team':
				result = await TeamHandlers.findTeam(parameters, userId);
				break;
			case 'add_team_member':
				result = await TeamHandlers.addTeamMember(parameters, userId);
				break;
			case 'remove_team_member':
				result = await TeamHandlers.removeTeamMember(parameters, userId);
				break;

			// User tools
			case 'list_users':
				result = await UserHandlers.listUsers(parameters, userId);
				break;
			case 'find_user':
				result = await UserHandlers.findUser(parameters, userId);
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
		console.log('[AI Controller] Health check requested');
		const isHealthy = await aiService.healthCheck();

		return res.json({
			success: true,
			healthy: isHealthy,
			message: isHealthy
				? 'AI service is running'
				: 'AI service is unavailable',
		});
	} catch (error: any) {
		console.error('=== AI CONTROLLER HEALTH CHECK ERROR ===');
		console.error('Error:', error.message);
		
		return res.status(503).json({
			success: false,
			healthy: false,
			error: error.message || 'AI service unavailable',
		});
	}
};
