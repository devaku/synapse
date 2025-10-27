import { Ollama } from 'ollama';
import { TaskTools, TaskSchemas } from '../mcp/tools/task-tools';
import { TeamTools, TeamSchemas } from '../mcp/tools/team-tools';
import { CommentTools, AdditionalTaskTools, CommentSchemas } from '../mcp/tools/comment-tools';

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
	private ollama: Ollama;
	private model: string = 'qwen3:4b';

	constructor() {
		this.ollama = new Ollama({ host: 'http://127.0.0.1:11434' });
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
		];
	}

	/**
	 * Generate system prompt with available MCP tools
	 */
	private getSystemPrompt(userId: number): string {
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
			// Try to extract JSON from response
			const jsonMatch = response.match(/\{[\s\S]*"toolCall"[\s\S]*\}/);
			if (!jsonMatch) return null;

			const parsed = JSON.parse(jsonMatch[0]);
			if (parsed.toolCall && parsed.toolCall.tool) {
				return {
					id: crypto.randomUUID(),
					type: 'function',
					function: {
						name: parsed.toolCall.tool,
						arguments: JSON.stringify(parsed.toolCall.parameters),
					},
				};
			}
		} catch (error) {
			console.error('Failed to parse tool call:', error);
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
	async chat(messages: ChatMessage[], userId: number): Promise<AIResponse> {
		try {
			// Prepend system prompt
			const systemPrompt = this.getSystemPrompt(userId);
			const fullMessages = [
				{ role: 'system' as const, content: systemPrompt },
				...messages,
			];

			// Call Ollama
			const response = await this.ollama.chat({
				model: this.model,
				messages: fullMessages,
				stream: false,
			});

			const content = response.message.content;

			// Check if response contains a tool call
			const toolCall = this.parseToolCall(content);

			if (toolCall) {
				const toolName = toolCall.function.name;
				const parameters = JSON.parse(toolCall.function.arguments);

				// Extract explanation from response
				const explanationMatch = content.match(
					/"explanation":\s*"([^"]*)"/
				);
				const explanation = explanationMatch
					? explanationMatch[1]
					: 'Executing action...';

				return {
					response: explanation,
					toolCall: {
						id: toolCall.id,
						tool: toolName,
						parameters,
						requiresConfirmation:
							this.requiresConfirmation(toolName),
						explanation,
					},
				};
			}

			// No tool call, just return response
			return {
				response: content,
			};
		} catch (error: any) {
			console.error('AI service error:', error);
			throw new Error(
				`Failed to get AI response: ${error.message || 'Unknown error'}`
			);
		}
	}

	/**
	 * Stream chat response (for real-time UI updates)
	 */
	async *chatStream(
		messages: ChatMessage[],
		userId: number
	): AsyncGenerator<string> {
		try {
			const systemPrompt = this.getSystemPrompt(userId);
			const fullMessages = [
				{ role: 'system' as const, content: systemPrompt },
				...messages,
			];

			const stream = await this.ollama.chat({
				model: this.model,
				messages: fullMessages,
				stream: true,
			});

			for await (const chunk of stream) {
				yield chunk.message.content;
			}
		} catch (error) {
			console.error('AI stream error:', error);
			throw error;
		}
	}

	/**
	 * Check if Ollama is available
	 */
	async healthCheck(): Promise<boolean> {
		try {
			await this.ollama.list();
			return true;
		} catch (error) {
			console.error('Ollama health check failed:', error);
			return false;
		}
	}
}

export const aiService = new AIService();
