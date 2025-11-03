import axios, { AxiosInstance } from 'axios';
import { Ollama } from 'ollama';
import { TaskTools, TaskSchemas } from '../mcp/tools/task-tools';
import { TeamTools, TeamSchemas } from '../mcp/tools/team-tools';
import { CommentTools, AdditionalTaskTools, CommentSchemas } from '../mcp/tools/comment-tools';
import { UserTools, UserSchemas } from '../mcp/tools/user-tools';
import { AI_PROVIDER, AI_API_URL, AI_API_KEY, AI_MODEL_NAME, AI_ENABLE_MCP_TOOLS, AI_USE_SIMPLE_MODE } from '../lib/env-variables';

interface ChatMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

interface ToolCall {
	id: string;
	type: 'function';
	function: {
		name: string;
		arguments: string;
	};
}

interface AIResponse {
	response: string;
	toolCall?: {
		id: string;
		tool: string;
		parameters: any;
		requiresConfirmation: boolean;
		explanation?: string;
	};
}

export class AIService {
	private apiClient: AxiosInstance | null = null;
	private ollamaClient: Ollama | null = null;
	private provider: 'ollama' | 'server';
	private model: string;
	private apiUrl: string;

	constructor() {
		this.provider = AI_PROVIDER as 'ollama' | 'server';
		this.model = AI_MODEL_NAME;
		this.apiUrl = AI_API_URL;
		
		console.log(`[AI Service] Initializing with provider: ${this.provider}`);
		console.log(`[AI Service] Model: ${this.model}`);
		console.log(`[AI Service] API URL: ${this.apiUrl}`);
		
		if (this.provider === 'ollama') {
			// Initialize Ollama client for local usage
			this.ollamaClient = new Ollama({
				host: this.apiUrl,
			});
			console.log('[AI Service] Ollama client initialized for local model');
		} else {
			// Initialize axios client for remote server
			this.apiClient = axios.create({
				baseURL: this.apiUrl,
				headers: {
					'Content-Type': 'application/json',
					...(AI_API_KEY && { 'Authorization': `Bearer ${AI_API_KEY}` }),
				},
				timeout: 60000, // 60 second timeout
			});
			console.log('[AI Service] Axios client initialized for remote server');
		}
	}

	/**
	 * Get all available MCP tools
	 */
	private getMCPTools() {
		return [
			...Object.values(TaskTools),
			...Object.values(TeamTools),
			...Object.values(CommentTools),
			...Object.values(AdditionalTaskTools),
			...Object.values(UserTools),
		];
	}

	/**
	 * Convert MCP tools to OpenAI-compatible tool format
	 */
	private getMCPToolsFormatted() {
		const tools = this.getMCPTools();
		
		return tools.map((tool) => ({
			type: 'function',
			function: {
				name: tool.name,
				description: tool.description,
				parameters: tool.inputSchema,
			},
		}));
	}

	/**
	 * Convert MCP tools to Ollama-native tool format
	 */
	private getMCPToolsForOllama() {
		const tools = this.getMCPTools();
		
		return tools.map((tool) => ({
			type: 'function',
			function: {
				name: tool.name,
				description: tool.description,
				parameters: tool.inputSchema,
			},
		}));
	}

	/**
	 * Generate system prompt with available MCP tools
	 */
	private getSystemPrompt(userId: number, includeMCPTools: boolean = true): string {
		if (!includeMCPTools) {
			// Simple prompt without tool descriptions
			return `You are an AI assistant for the Synapse Task Management application. You help users manage their tasks and teams efficiently.

Current user ID: ${userId}

Be helpful, concise, and conversational. Help users accomplish their task management goals.`;
		}

		const tools = this.getMCPTools();

		const toolDescriptions = tools
			.map((tool) => {
				const schema: any = tool.inputSchema;
				return `- ${tool.name}: ${tool.description}\n  Parameters: ${JSON.stringify(schema.properties || {}, null, 2)}`;
			})
			.join('\n\n');

		return `You are an AI assistant for the Synapse Task Management application. You help users manage their tasks and teams efficiently.

Available tools:
${toolDescriptions}

IMPORTANT: When a user asks you to perform an action, respond with a structured tool call in this EXACT JSON format:
{
  "toolCall": {
    "tool": "tool_name",
    "parameters": {
      /* fill with required parameters based on the tool schema */
    }
  },
  "explanation": "Brief explanation of what you're about to do"
}

For example, if user says "Create a task called Review PR with high priority":
{
  "toolCall": {
    "tool": "create_task",
    "parameters": {
      "name": "Review PR",
      "description": "Review pull request",
      "priority": "HIGH"
    }
  },
  "explanation": "I'll create a high priority task called 'Review PR' for you."
}

Rules:
1. For write operations (create, update, delete), always format as JSON with toolCall
2. For read operations (read_tasks, list_teams), you can use toolCall or respond directly
3. Always be helpful and concise
4. Current user ID: ${userId}
5. Include all required parameters from the tool schema
6. Use proper enum values (e.g., priority: "LOW", "MEDIUM", "HIGH", "URGENT")

Be conversational but precise. Help users accomplish their task management goals.`;
	}

	/**
	 * Parse tool calls from AI response
	 */
	private parseToolCall(response: string): ToolCall | null {
		try {
			console.log('[AI Service] Attempting to parse tool call from response...');
			console.log('[AI Service] Response preview:', response.substring(0, 200) + '...');
			
			// Try to extract JSON from response
			const jsonMatch = response.match(/\{[\s\S]*"toolCall"[\s\S]*\}/);
			
			if (!jsonMatch) {
				console.log('[AI Service] No toolCall JSON pattern found in response');
				
				// Check if the response mentions any tool names
				const toolNames = [
					'create_task', 'update_task', 'list_tasks', 'read_tasks',
					'create_team', 'list_teams', 'add_team_member',
					'add_comment', 'read_comments'
				];
				
				const mentionedTool = toolNames.find(tool => response.toLowerCase().includes(tool));
				if (mentionedTool) {
					console.log(`[AI Service] WARNING: Response mentions "${mentionedTool}" but no proper toolCall format found!`);
					console.log('[AI Service] The AI might be trying to use tools but not formatting correctly.');
				}
				
				return null;
			}

			console.log('[AI Service] Found potential toolCall JSON, attempting to parse...');
			const parsed = JSON.parse(jsonMatch[0]);
			
			if (parsed.toolCall && parsed.toolCall.tool) {
				console.log('[AI Service] ✅ Successfully parsed tool call:', parsed.toolCall.tool);
				console.log('[AI Service] Tool parameters:', JSON.stringify(parsed.toolCall.parameters, null, 2));
				
				return {
					id: crypto.randomUUID(),
					type: 'function',
					function: {
						name: parsed.toolCall.tool,
						arguments: JSON.stringify(parsed.toolCall.parameters),
					},
				};
			} else {
				console.log('[AI Service] JSON found but missing toolCall structure');
			}
		} catch (error) {
			console.error('[AI Service] Failed to parse tool call:', error);
		}
		return null;
	}

	/**
	 * Check if tool requires user confirmation
	 */
	private requiresConfirmation(toolName: string): boolean {
		// Write operations require confirmation
		const writeTools = [
			'create_task',
			'update_task',
			'create_team',
			'add_team_member',
			'remove_team_member',
			'archive_task',
		];
		return writeTools.includes(toolName);
	}

	/**
	 * Chat with AI and get response with potential tool calls
	 */
	async chat(messages: ChatMessage[], userId: number, includeMCPTools: boolean = AI_ENABLE_MCP_TOOLS): Promise<AIResponse> {
		if (this.provider === 'ollama') {
			return this.chatWithOllama(messages, userId, includeMCPTools);
		} else {
			return this.chatWithServer(messages, userId, includeMCPTools);
		}
	}

	/**
	 * Chat with Ollama local model
	 */
	private async chatWithOllama(messages: ChatMessage[], userId: number, includeMCPTools: boolean): Promise<AIResponse> {
		try {
			if (!this.ollamaClient) {
				throw new Error('Ollama client not initialized');
			}

			console.log('[AI Service - Ollama] Starting chat request...');
			console.log('[AI Service - Ollama] Model:', this.model);
			console.log('[AI Service - Ollama] Messages count:', messages.length);
			console.log('[AI Service - Ollama] Include MCP Tools:', includeMCPTools);

			// Prepare messages with system prompt
			const systemPrompt = this.getSystemPrompt(userId, includeMCPTools);
			const fullMessages = [
				{ role: 'system' as const, content: systemPrompt },
				...messages,
			];

			// Prepare request options
			const requestOptions: any = {
				model: this.model,
				messages: fullMessages,
				stream: false,
			};

			// Add tools if enabled
			if (includeMCPTools) {
				const tools = this.getMCPToolsForOllama();
				requestOptions.tools = tools;
				console.log('[AI Service - Ollama] MCP Tools enabled, sending', tools.length, 'tools to model');
				console.log('[AI Service - Ollama] Tool format sample:', JSON.stringify(tools[0], null, 2));
			}

			console.log('[AI Service - Ollama] Calling Ollama chat API...');
			const response: any = await this.ollamaClient.chat(requestOptions);

			console.log('[AI Service - Ollama] Response received');
			
			const content = response.message?.content || '';
			console.log('[AI Service - Ollama] Content:', content);

			// Check for tool calls in response
			if (response.message?.tool_calls && response.message.tool_calls.length > 0) {
				const toolCall = response.message.tool_calls[0];
				console.log('[AI Service - Ollama] Tool call detected:', toolCall.function.name);

				return {
					response: content || 'Executing action...',
					toolCall: {
						id: `call_${Date.now()}`,
						tool: toolCall.function.name,
						parameters: toolCall.function.arguments,
						requiresConfirmation: this.requiresConfirmation(toolCall.function.name),
						explanation: content || 'Executing action...',
					},
				};
			}

			// Check if response text contains a tool call (fallback parsing)
			const parsedToolCall = this.parseToolCall(content);
			if (parsedToolCall) {
				console.log('[AI Service - Ollama] Tool call parsed from text:', parsedToolCall.function.name);
				const toolName = parsedToolCall.function.name;
				const parameters = JSON.parse(parsedToolCall.function.arguments);

				return {
					response: content,
					toolCall: {
						id: parsedToolCall.id,
						tool: toolName,
						parameters,
						requiresConfirmation: this.requiresConfirmation(toolName),
						explanation: content,
					},
				};
			}

			// No tool call, just return response
			console.log('[AI Service - Ollama] No tool call detected, returning response');
			return {
				response: content,
			};
		} catch (error: any) {
			console.error('=== AI SERVICE OLLAMA ERROR ===');
			console.error('Error type:', error.constructor.name);
			console.error('Error message:', error.message);
			console.error('Error stack:', error.stack);

			throw new Error(`Ollama Error: ${error.message}`);
		}
	}

	/**
	 * Chat with remote server
	 */
	private async chatWithServer(messages: ChatMessage[], userId: number, includeMCPTools: boolean): Promise<AIResponse> {
		try {
			if (!this.apiClient) {
				throw new Error('API client not initialized');
			}

			// Validate configuration
			if (!this.apiUrl) {
				throw new Error('AI_API_URL is not configured in environment variables');
			}
			if (!AI_API_KEY) {
				throw new Error('AI_API_KEY is not configured in environment variables');
			}

			console.log('[AI Service - Server] Starting chat request...');
			console.log('[AI Service - Server] API URL:', this.apiUrl);
			console.log('[AI Service - Server] Model:', this.model);
			console.log('[AI Service - Server] Messages count:', messages.length);
			console.log('[AI Service - Server] Include MCP Tools:', includeMCPTools);
			console.log('[AI Service - Server] Simple Mode (no system prompt):', AI_USE_SIMPLE_MODE);

			// Prepare messages based on mode
			let fullMessages;
			
			if (AI_USE_SIMPLE_MODE) {
				// SIMPLE MODE: Send only user messages, NO system prompt
				console.log('[AI Service - Server] Using SIMPLE MODE - no system prompt, minimal request');
				fullMessages = messages;
			} else {
				// NORMAL MODE: Include system prompt
				const systemPrompt = this.getSystemPrompt(userId, includeMCPTools);
				fullMessages = [
					{ role: 'system' as const, content: systemPrompt },
					...messages,
				];
			}

			// Prepare request payload
			const requestPayload: any = {
				model: AI_USE_SIMPLE_MODE ? "llama" : this.model,
				messages: fullMessages,
				max_tokens: 2000,
				temperature: 0.7,
			};

			// Only include tools if requested AND not in simple mode
			if (includeMCPTools && !AI_USE_SIMPLE_MODE) {
				const tools = this.getMCPToolsFormatted();
				requestPayload.tools = tools;
				console.log('[AI Service - Server] Tools exposed:', tools.length);
			} else {
				console.log('[AI Service - Server] MCP Tools disabled for this request');
			}

			console.log('[AI Service - Server] Request payload summary:', JSON.stringify({
				model: requestPayload.model,
				messagesCount: requestPayload.messages.length,
				max_tokens: requestPayload.max_tokens,
				temperature: requestPayload.temperature,
				toolsCount: requestPayload.tools?.length || 0,
				hasTools: !!requestPayload.tools,
			}, null, 2));

			// Call AI API with custom format
			const response = await this.apiClient.post('', requestPayload, {
				headers: {
					'X-RAG-Mode': 'false',
				},
			});

			console.log('[AI Service - Server] Response status:', response.status);

			// Handle response
			let content: string;
			
			if (response.data.choices && response.data.choices.length > 0) {
				content = response.data.choices[0].message?.content || response.data.choices[0].delta?.content || '';
				console.log('[AI Service - Server] Using choices format');
			} else if (response.data.response) {
				content = response.data.response;
				console.log('[AI Service - Server] Using response format');
			} else if (response.data.content) {
				content = response.data.content;
				console.log('[AI Service - Server] Using content format');
			} else {
				console.warn('[AI Service - Server] Unknown response format');
				content = JSON.stringify(response.data);
			}

			if (!content || content.trim() === '') {
				console.error('[AI Service - Server] WARNING: Empty content extracted from response!');
				content = 'I apologize, but I received an empty response. Please try again.';
			}

			console.log('[AI Service - Server] Extracted content:', content);

			// Check if response contains a tool call
			const toolCall = this.parseToolCall(content);

			if (toolCall) {
				console.log('[AI Service - Server] Tool call detected:', toolCall.function.name);
				const toolName = toolCall.function.name;
				const parameters = JSON.parse(toolCall.function.arguments);

				const explanationMatch = content.match(/"explanation":\s*"([^"]*)"/);
				const explanation = explanationMatch ? explanationMatch[1] : 'Executing action...';

				return {
					response: explanation,
					toolCall: {
						id: toolCall.id,
						tool: toolName,
						parameters,
						requiresConfirmation: this.requiresConfirmation(toolName),
						explanation,
					},
				};
			}

			// No tool call, just return response
			console.log('[AI Service - Server] No tool call detected, returning response');
			return {
				response: content,
			};
		} catch (error: any) {
			console.error('=== AI SERVICE SERVER ERROR ===');
			console.error('Error type:', error.constructor.name);
			console.error('Error message:', error.message);
			
			if (error.response) {
				console.error('Response status:', error.response.status);
				console.error('Response data:', JSON.stringify(error.response.data, null, 2));
				
				throw new Error(
					`AI API Error (${error.response.status}): ${
						error.response.data?.error || 
						error.response.data?.message || 
						error.response.statusText
					}`
				);
			} else if (error.request) {
				// The request was made but no response was received
				console.error('Request details:', {
					url: this.apiUrl,
					method: 'POST',
					timeout: '60000ms',
				});
				console.error('No response received from server');
				
				throw new Error(
					`AI API Connection Error: No response received from ${this.apiUrl}. ` +
					`Please check if the server is running and accessible. ` +
					`Error: ${error.message}`
				);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.error('Error details:', error);
				console.error('Stack trace:', error.stack);
				
				throw new Error(
					`AI Service Setup Error: ${error.message}. ` +
					`Check your AI_API_URL and AI_API_KEY configuration.`
				);
			}
		}
	}

	/**
	 * Stream chat response (for real-time UI updates)
	 */
	async *chatStream(
		messages: ChatMessage[],
		userId: number
	): AsyncGenerator<string> {
		if (this.provider === 'ollama') {
			yield* this.chatStreamOllama(messages, userId);
		} else {
			yield* this.chatStreamServer(messages, userId);
		}
	}

	/**
	 * Stream chat response with Ollama
	 */
	private async *chatStreamOllama(
		messages: ChatMessage[],
		userId: number
	): AsyncGenerator<string> {
		try {
			if (!this.ollamaClient) {
				throw new Error('Ollama client not initialized');
			}

			console.log('[AI Service - Ollama] Starting streaming chat request...');
			console.log('[AI Service - Ollama] Model:', this.model);

			const systemPrompt = this.getSystemPrompt(userId);
			const fullMessages = [
				{ role: 'system' as const, content: systemPrompt },
				...messages,
			];

			// Ollama uses native tool format, not OpenAI format
			const mcpTools = this.getMCPTools();
			const ollamaTools = mcpTools.map((tool) => ({
				type: 'function',
				function: {
					name: tool.name,
					description: tool.description,
					parameters: tool.inputSchema,
				},
			}));
			console.log('[AI Service - Ollama] Tools exposed for streaming:', ollamaTools.length);

			const stream = await this.ollamaClient.chat({
				model: this.model,
				messages: fullMessages,
				stream: true,
				tools: ollamaTools as any, // Cast to any due to type mismatch
			});

			console.log('[AI Service - Ollama] Streaming response started');

			for await (const chunk of stream) {
				if (chunk.message?.content) {
					yield chunk.message.content;
				}
			}

			console.log('[AI Service - Ollama] Streaming completed');
		} catch (error: any) {
			console.error('=== AI SERVICE OLLAMA STREAMING ERROR ===');
			console.error('Error:', error.message);
			throw new Error(`Ollama Streaming Error: ${error.message}`);
		}
	}

	/**
	 * Stream chat response with remote server
	 */
	private async *chatStreamServer(
		messages: ChatMessage[],
		userId: number
	): AsyncGenerator<string> {
		try {
			if (!this.apiClient) {
				throw new Error('API client not initialized');
			}

			// Validate configuration
			if (!this.apiUrl) {
				throw new Error('AI_API_URL is not configured in environment variables');
			}
			if (!AI_API_KEY) {
				throw new Error('AI_API_KEY is not configured in environment variables');
			}

			console.log('[AI Service - Server] Starting streaming chat request...');
			console.log('[AI Service - Server] API URL:', this.apiUrl);
			console.log('[AI Service - Server] Model:', this.model);

			const systemPrompt = this.getSystemPrompt(userId);
			const fullMessages = [
				{ role: 'system' as const, content: systemPrompt },
				...messages,
			];

			const tools = this.getMCPToolsFormatted();
			console.log('[AI Service - Server] Tools exposed for streaming:', tools.length);

			const response = await this.apiClient.post('', {
				model: this.model,
				messages: fullMessages,
				stream: true,
				temperature: 0.7,
				max_tokens: 2000,
				tools: tools,
			}, {
				responseType: 'stream',
				headers: {
					'X-RAG-Mode': 'false',
				},
			});

			console.log('[AI Service - Server] Streaming response started');

			// Parse SSE (Server-Sent Events) stream
			for await (const chunk of response.data) {
				const lines = chunk.toString().split('\n').filter((line: string) => line.trim() !== '');
				
				for (const line of lines) {
					if (line.startsWith('data: ')) {
						const data = line.slice(6);
						if (data === '[DONE]') continue;
						
						try {
							const parsed = JSON.parse(data);
							const content = parsed.choices?.[0]?.delta?.content || parsed.content || parsed.response;
							if (content) {
								yield content;
							}
						} catch (e) {
							console.warn('[AI Service] Failed to parse streaming chunk:', e);
							// Skip malformed chunks
							continue;
						}
					}
				}
			}

			console.log('[AI Service] Streaming completed');
		} catch (error: any) {
			console.error('=== AI SERVICE STREAMING ERROR ===');
			console.error('Error type:', error.constructor.name);
			console.error('Error message:', error.message);
			
			if (error.response) {
				console.error('Response status:', error.response.status);
				console.error('Response data:', error.response.data);
				throw new Error(
					`AI Streaming Error (${error.response.status}): ${
						error.response.data?.error || 
						error.response.data?.message || 
						error.response.statusText
					}`
				);
			} else if (error.request) {
				console.error('No response received for streaming request');
				throw new Error(`AI Streaming Connection Error: No response from ${this.apiUrl}`);
			} else {
				console.error('Streaming setup error:', error);
				throw new Error(`AI Streaming Setup Error: ${error.message}`);
			}
		}
	}

	/**
	 * Check if AI API is available
	 */
	async healthCheck(): Promise<boolean> {
		try {
			console.log('[AI Service] Running health check...');
			console.log('[AI Service] Provider:', this.provider);
			console.log('[AI Service] API URL:', this.apiUrl);
			console.log('[AI Service] Model:', this.model);
			
			if (!this.apiUrl) {
				console.error('[AI Service] Health check failed: AI_API_URL not configured');
				return false;
			}

			if (this.provider === 'ollama') {
				// Check Ollama health
				if (!this.ollamaClient) {
					console.error('[AI Service] Health check failed: Ollama client not initialized');
					return false;
				}

				// Try to list models to verify connection
				const models = await this.ollamaClient.list();
				console.log('[AI Service] Health check - Ollama available, models:', models.models?.length || 0);
				console.log('[AI Service] Health check - SUCCESS');
				return true;
			} else {
				// Check server health
				if (!this.apiClient) {
					console.error('[AI Service] Health check failed: API client not initialized');
					return false;
				}

				if (!AI_API_KEY) {
					console.error('[AI Service] Health check failed: AI_API_KEY not configured');
					return false;
				}
				
				// Try a simple test request
				const response = await this.apiClient.post('', {
					model: this.model,
					messages: [{ role: 'user', content: 'test' }],
					max_tokens: 10,
					temperature: 0.7,
				}, {
					timeout: 10000,
					headers: {
						'X-RAG-Mode': 'false',
					},
				});
				
				console.log('[AI Service] Health check - Response status:', response.status);
				console.log('[AI Service] Health check - SUCCESS');
				return response.status === 200;
			}
		} catch (error: any) {
			console.error('=== AI SERVICE HEALTH CHECK FAILED ===');
			console.error('Error message:', error.message);
			
			if (error.response) {
				console.error('Response status:', error.response.status);
				console.error('Response data:', JSON.stringify(error.response.data, null, 2));
			} else if (error.request) {
				console.error('No response received from:', this.apiUrl);
			} else {
				console.error('Health check setup error:', error);
			}
			
			return false;
		}
	}
}

export const aiService = new AIService();
