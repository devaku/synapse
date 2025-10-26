/**
 * MCP Service - API calls for AI Chat and MCP integration
 * 
 * This service handles communication with the AI endpoints:
 * - POST /api/v1/ai/chat - Chat with AI
 * - POST /api/v1/ai/chat/stream - Stream chat responses
 * - POST /api/v1/ai/execute-tool - Execute tool calls
 * - GET /api/v1/ai/health - Check AI service health
 */

import type {
	MCPMessage,
	MCPToolCall,
} from '../../types/mcp';

const AI_BASE_URL = '/api/v1/ai';

/**
 * Send a message to the AI and get a response
 */
export async function sendToAI(
	token: string,
	messages: MCPMessage[]
): Promise<{
	response: string;
	toolCall?: {
		id: string;
		tool: string;
		parameters: Record<string, any>;
		requiresConfirmation: boolean;
	};
}> {
	try {
		const response = await fetch(`${AI_BASE_URL}/chat`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ messages }),
		});

		if (!response.ok) {
			throw new Error(`Failed to chat with AI: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error('Error chatting with AI:', error);
		throw error;
	}
}

/**
 * Execute an approved tool call
 */
export async function executeTool(
	token: string,
	toolCallId: string,
	tool: string,
	parameters: Record<string, any>
): Promise<any> {
	try {
		const response = await fetch(`${AI_BASE_URL}/execute-tool`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				toolCallId,
				tool,
				parameters,
			}),
		});

		if (!response.ok) {
			throw new Error(`Failed to execute tool: ${response.statusText}`);
		}

		const data = await response.json();
		return data.result;
	} catch (error) {
		console.error('Error executing tool:', error);
		throw error;
	}
}

/**
 * Check if AI service is available
 */
export async function checkAIHealth(token: string): Promise<boolean> {
	try {
		const response = await fetch(`${AI_BASE_URL}/health`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			return false;
		}

		const data = await response.json();
		return data.healthy;
	} catch (error) {
		console.error('Error checking AI health:', error);
		return false;
	}
}

/**
 * Stream chat responses (SSE)
 * Returns an async generator that yields response chunks
 */
export async function* streamChat(
	token: string,
	messages: MCPMessage[]
): AsyncGenerator<string, void, unknown> {
	const response = await fetch(`${AI_BASE_URL}/chat/stream`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ messages }),
	});

	if (!response.ok || !response.body) {
		throw new Error('Failed to stream chat');
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();

	try {
		while (true) {
			const { done, value } = await reader.read();
			
			if (done) break;

			const chunk = decoder.decode(value, { stream: true });
			const lines = chunk.split('\n');

			for (const line of lines) {
				if (line.startsWith('data: ')) {
					const data = line.slice(6);
					if (data === '[DONE]') {
						return;
					}
					try {
						const parsed = JSON.parse(data);
						if (parsed.chunk) {
							yield parsed.chunk;
						}
					} catch (e) {
						// Skip invalid JSON
					}
				}
			}
		}
	} finally {
		reader.releaseLock();
	}
}

/**
 * Format tool call for display
 */
export function formatToolCall(toolCall: MCPToolCall): string {
	return `Tool: ${toolCall.tool}\n\nParameters:\n${JSON.stringify(
		toolCall.parameters,
		null,
		2
	)}`;
}
