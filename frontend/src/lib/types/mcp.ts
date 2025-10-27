/**
 * MCP (Model Context Protocol) Type Definitions
 * These types define the structure for AI-powered task management
 */

export interface MCPMessage {
	id: string;
	role: 'user' | 'assistant' | 'system';
	content: string;
	timestamp: Date;
	toolCalls?: MCPToolCall[];
}

export interface MCPToolCall {
	id: string;
	tool: string;
	parameters: Record<string, any>;
	requiresConfirmation: boolean;
	status: 'pending' | 'approved' | 'rejected' | 'executed';
	result?: MCPToolResult;
}

export interface MCPToolResult {
	success: boolean;
	message: string;
	data?: any;
	error?: string;
}

export interface MCPTool {
	name: string;
	description: string;
	requiresConfirmation: boolean;
	inputSchema: MCPToolInputSchema;
	outputSchema?: MCPToolOutputSchema;
}

export interface MCPToolInputSchema {
	type: 'object';
	required?: string[];
	properties: Record<string, MCPSchemaProperty>;
	additionalProperties?: boolean;
}

export interface MCPToolOutputSchema {
	type: 'object';
	required?: string[];
	properties: Record<string, MCPSchemaProperty>;
}

export interface MCPSchemaProperty {
	type: string | string[];
	description?: string;
	enum?: string[];
	items?: MCPSchemaProperty;
	format?: string;
	minLength?: number;
	maxLength?: number;
	minimum?: number;
	maximum?: number;
	default?: any;
	uniqueItems?: boolean;
}

// Request/Response types for MCP API
export interface MCPListToolsRequest {
	// Empty for now, might add filters later
}

export interface MCPListToolsResponse {
	tools: MCPTool[];
}

export interface MCPCallToolRequest {
	tool: string;
	parameters: Record<string, any>;
}

export interface MCPCallToolResponse {
	success: boolean;
	message: string;
	data?: any;
	error?: string;
}

// Chat conversation types
export interface MCPConversation {
	id: string;
	title: string;
	messages: MCPMessage[];
	createdAt: Date;
	updatedAt: Date;
}

// LLM Integration types
export interface LLMRequest {
	messages: Array<{
		role: 'user' | 'assistant' | 'system';
		content: string;
	}>;
	tools?: MCPTool[];
	temperature?: number;
	maxTokens?: number;
}

export interface LLMResponse {
	content: string;
	toolCalls?: Array<{
		tool: string;
		parameters: Record<string, any>;
	}>;
	finishReason: 'stop' | 'length' | 'tool_calls';
}

// Specific tool parameter types based on your schema
export interface CreateTaskParams {
	name: string;
	description: string;
	priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
	startDate?: string;
	completeDate?: string;
	taskVisibleToUsers?: number[];
	taskVisibleToTeams?: number[];
	taskHiddenFromUsers?: number[];
}

export interface ReadTasksParams {
	taskId?: number;
	userOnly?: boolean;
	subscribedOnly?: boolean;
	status?: 'active' | 'archived' | 'all';
}

export interface UpdateTaskParams {
	taskId: number;
	name?: string;
	description?: string;
	priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
	startDate?: string;
	completeDate?: string;
	taskVisibleToUsers?: number[];
	taskVisibleToTeams?: number[];
	taskHiddenFromUsers?: number[];
}

export interface CreateTeamParams {
	name: string;
	description?: string;
	memberIds?: number[];
}

export interface AddCommentParams {
	taskId: number;
	message: string;
}

export interface SubscribeTaskParams {
	taskId: number;
}
