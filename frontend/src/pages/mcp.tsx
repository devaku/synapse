import { useState, useRef, useEffect } from 'react';
import HeaderContainer from '../components/container/header_container';
import Button from '../components/ui/button';
import SvgComponent from '../components/ui/svg_component';
import SlideModalContainer from '../components/container/modal_containers/slide_modal_container';
import { useModal } from '../lib/hooks/ui/useModal';
import { useAuthContext } from '../lib/contexts/AuthContext';
import { sendToAI, executeTool } from '../lib/services/api/mcp';

/**
 * TYPES
 */

interface Message {
	id: string;
	role: 'user' | 'assistant' | 'system';
	content: string;
	timestamp: Date;
	toolCalls?: ToolCall[];
	isStreaming?: boolean; // For streaming messages
}

interface ToolCall {
	id: string;
	tool: string;
	parameters: Record<string, any>;
	requiresConfirmation: boolean;
	status: 'pending' | 'approved' | 'rejected' | 'executed';
	result?: any;
}

interface MCPTool {
	name: string;
	description: string;
	requiresConfirmation: boolean;
	inputSchema: any;
}

// Progress stages for better UX
type AIProgressStage = 
	| 'idle'
	| 'sending'      // Sending request to server
	| 'thinking'     // AI is processing
	| 'generating'   // AI is generating response
	| 'parsing'      // Parsing tool calls
	| 'complete';    // Done

export default function MCPChatPage() {
	const { token, serverData } = useAuthContext();
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			role: 'system',
			content:
				'Welcome! I can help you manage tasks and teams. Try asking me to create a task, list your tasks, or create a team.',
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [aiProgress, setAIProgress] = useState<AIProgressStage>('idle');
	const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
	const [availableTools, setAvailableTools] = useState<MCPTool[]>([]);
	const [pendingToolCall, setPendingToolCall] = useState<ToolCall | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Modal for tool confirmation
	const confirmationModal = useModal();

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// Fetch available MCP tools on component mount
	useEffect(() => {
		fetchAvailableTools();
	}, []);

	/**
	 * MCP INTEGRATION FUNCTIONS - PLACEHOLDERS
	 * These will be implemented to communicate with the MCP server
	 */

	// Fetch list of available tools from MCP server
	const fetchAvailableTools = async () => {
		try {
			// Not needed anymore - AI knows all tools internally
			// Keeping this as a placeholder for future enhancements
			setAvailableTools([]);
		} catch (error) {
			console.error('Failed to fetch MCP tools:', error);
		}
	};

	// Send message to LLM and get response with potential tool calls
	const sendMessageToLLM = async (userMessage: string) => {
		try {
			setIsLoading(true);
			setAIProgress('sending');

			// Build conversation history
			const conversationHistory = messages
				.filter((m) => m.role !== 'system' || m.content.startsWith('✅') || m.content.startsWith('❌'))
				.map((m) => ({
					role: m.role,
					content: m.content,
				}));

			// Add user message
			conversationHistory.push({
				role: 'user',
				content: userMessage,
			});

			setAIProgress('thinking');

			// Create a streaming message placeholder
			const streamingMessageId = crypto.randomUUID();
			setStreamingMessageId(streamingMessageId);
			
			const streamingMessage: Message = {
				id: streamingMessageId,
				role: 'assistant',
				content: '',
				timestamp: new Date(),
				isStreaming: true,
			};
			
			setMessages((prev) => [...prev, streamingMessage]);
			setAIProgress('generating');

			// Call AI endpoint (non-streaming for now, but shows progress)
			const result = await sendToAI(token!, conversationHistory as any);

			setAIProgress('parsing');

			// Update the streaming message with final content
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === streamingMessageId
						? { ...msg, content: result.response, isStreaming: false }
						: msg
				)
			);

			// Check if AI wants to call a tool
			if (result.toolCall) {
				const toolCall: ToolCall = {
					id: result.toolCall.id,
					tool: result.toolCall.tool,
					parameters: result.toolCall.parameters,
					requiresConfirmation: result.toolCall.requiresConfirmation,
					status: result.toolCall.requiresConfirmation ? 'pending' : 'approved',
				};

				// Add tool call to the message
				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === streamingMessageId
							? { ...msg, toolCalls: [toolCall] }
							: msg
					)
				);

				if (toolCall.requiresConfirmation) {
					setPendingToolCall(toolCall);
					confirmationModal.open();
				} else {
					// Auto-execute if no confirmation needed
					await executeToolCall(toolCall);
				}
			}

			setAIProgress('complete');
			setTimeout(() => setAIProgress('idle'), 500);
		} catch (error) {
			console.error('Failed to get LLM response:', error);
			addSystemMessage('Error communicating with AI assistant.');
			setAIProgress('idle');
		} finally {
			setIsLoading(false);
			setStreamingMessageId(null);
		}
	};

	// Execute approved tool call via MCP server
	const executeToolCall = async (toolCall: ToolCall) => {
		try {
			setIsLoading(true);

			// Call execute-tool endpoint
			const result = await executeTool(
				token!,
				toolCall.id,
				toolCall.tool,
				toolCall.parameters
			);

			// Update tool call status
			setMessages((prev) =>
				prev.map((msg) => {
					if (msg.toolCalls) {
						return {
							...msg,
							toolCalls: msg.toolCalls.map((tc) =>
								tc.id === toolCall.id
									? {
											...tc,
											status: 'executed' as const,
											result: result,
									  }
									: tc
							),
						};
					}
					return msg;
				})
			);

			// Add result message
			addSystemMessage(
				`✅ Action completed successfully: ${JSON.stringify(result, null, 2)}`
			);
		} catch (error: any) {
			console.error('Failed to execute tool call:', error);
			addSystemMessage(`❌ Failed to execute action: ${error.message || 'Unknown error'}`);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle user message submission
	const handleSendMessage = async () => {
		if (!input.trim() || isLoading) return;

		const userMessage: Message = {
			id: crypto.randomUUID(),
			role: 'user',
			content: input,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput('');
		setIsLoading(true);

		await sendMessageToLLM(input);
		setIsLoading(false);
	};

	// Handle tool call approval
	const handleApproveToolCall = async () => {
		if (!pendingToolCall) return;

		confirmationModal.close();
		await executeToolCall(pendingToolCall);
		setPendingToolCall(null);
	};

	// Handle tool call rejection
	const handleRejectToolCall = () => {
		if (!pendingToolCall) return;

		setMessages((prev) =>
			prev.map((msg) => {
				if (msg.toolCalls) {
					return {
						...msg,
						toolCalls: msg.toolCalls.map((tc) =>
							tc.id === pendingToolCall.id
								? { ...tc, status: 'rejected' as const }
								: tc
						),
					};
				}
				return msg;
			})
		);

		addSystemMessage('❌ Action cancelled by user.');
		confirmationModal.close();
		setPendingToolCall(null);
	};

	// Add system message helper
	const addSystemMessage = (content: string) => {
		const systemMessage: Message = {
			id: crypto.randomUUID(),
			role: 'system',
			content,
			timestamp: new Date(),
		};
		setMessages((prev) => [...prev, systemMessage]);
	};

	// Handle Enter key press
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<HeaderContainer pageTitle="AI Assistant">
			<div className="h-full flex flex-col">
				{/* Chat Header with Info */}
				<div className="bg-ttg-black/5 rounded-lg p-4 mb-4">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-semibold text-ttg-black">
								MCP-Powered AI Assistant
							</h2>
							<p className="text-sm text-ttg-black/70">
								Ask me to create tasks, manage teams, or get information
							</p>
						</div>
						<div className="flex gap-2">
							<div className="bg-ttg-green/20 text-ttg-green px-3 py-1 rounded-full text-sm font-medium">
								{availableTools.length} tools available
							</div>
						</div>
					</div>
				</div>

				{/* AI Progress Indicator */}
				{aiProgress !== 'idle' && (
					<div className="bg-gradient-to-r from-ttg-purple/10 to-ttg-green/10 rounded-lg p-4 mb-4 border border-ttg-purple/20">
						<div className="flex items-center gap-3">
							{/* Animated spinner */}
							<div className="animate-spin rounded-full h-5 w-5 border-2 border-ttg-purple border-t-transparent" />
							
							{/* Progress text */}
							<div className="flex-1">
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm font-medium text-ttg-black">
										{aiProgress === 'sending' && '📤 Sending request...'}
										{aiProgress === 'thinking' && '🧠 AI is thinking...'}
										{aiProgress === 'generating' && '✨ Generating response...'}
										{aiProgress === 'parsing' && '🔍 Processing tool calls...'}
										{aiProgress === 'complete' && '✅ Complete!'}
									</span>
									<span className="text-xs text-ttg-black/60">
										{aiProgress === 'sending' && '10%'}
										{aiProgress === 'thinking' && '30%'}
										{aiProgress === 'generating' && '70%'}
										{aiProgress === 'parsing' && '90%'}
										{aiProgress === 'complete' && '100%'}
									</span>
								</div>
								
								{/* Progress bar */}
								<div className="w-full bg-ttg-black/10 rounded-full h-2 overflow-hidden">
									<div
										className={`h-full bg-gradient-to-r from-ttg-purple to-ttg-green transition-all duration-500 ease-out ${
											aiProgress === 'sending' ? 'w-[10%]' :
											aiProgress === 'thinking' ? 'w-[30%]' :
											aiProgress === 'generating' ? 'w-[70%]' :
											aiProgress === 'parsing' ? 'w-[90%]' :
											'w-full'
										}`}
									/>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Messages Container */}
				<div className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200 mb-4 p-4">
					<div className="space-y-4">
						{messages.map((message) => (
							<div key={message.id}>
								{/* Message Bubble */}
								<div
									className={`flex ${
										message.role === 'user'
											? 'justify-end'
											: 'justify-start'
									}`}
								>
									<div
										className={`max-w-[70%] rounded-lg px-4 py-3 ${
											message.role === 'user'
												? 'bg-ttg-green text-white'
												: message.role === 'system'
												? 'bg-ttg-brown/20 text-ttg-black'
												: 'bg-ttg-black/10 text-ttg-black'
										}`}
									>
										<div className="flex items-start gap-2">
											{message.role === 'assistant' && (
												<span className="text-lg">🤖</span>
											)}
											{message.role === 'system' && (
												<span className="text-lg">ℹ️</span>
											)}
											<div className="flex-1">
												<p className="whitespace-pre-wrap">
													{message.content}
												</p>
												
												{/* Typing indicator for streaming messages */}
												{message.isStreaming && !message.content && (
													<div className="flex items-center gap-1 py-2">
														<div className="w-2 h-2 bg-ttg-black/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
														<div className="w-2 h-2 bg-ttg-black/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
														<div className="w-2 h-2 bg-ttg-black/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
													</div>
												)}
												
												<p className="text-xs opacity-70 mt-1">
													{message.timestamp.toLocaleTimeString()}
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Tool Calls Display */}
								{message.toolCalls &&
									message.toolCalls.map((toolCall) => (
										<div
											key={toolCall.id}
											className="ml-12 mt-2 bg-ttg-purple/10 border border-ttg-purple/30 rounded-lg p-3"
										>
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-2">
														<span className="text-sm font-semibold text-ttg-purple">
															🔧 {toolCall.tool}
														</span>
														<span
															className={`text-xs px-2 py-1 rounded-full ${
																toolCall.status === 'pending'
																	? 'bg-yellow-500/20 text-yellow-700'
																	: toolCall.status === 'approved'
																	? 'bg-blue-500/20 text-blue-700'
																	: toolCall.status === 'executed'
																	? 'bg-green-500/20 text-green-700'
																	: 'bg-red-500/20 text-red-700'
															}`}
														>
															{toolCall.status}
														</span>
													</div>
													<pre className="text-xs bg-white/50 p-2 rounded overflow-x-auto">
														{JSON.stringify(
															toolCall.parameters,
															null,
															2
														)}
													</pre>
													{toolCall.result && (
														<div className="mt-2">
															<span className="text-xs font-semibold">
																Result:
															</span>
															<pre className="text-xs bg-green-500/10 p-2 rounded mt-1 overflow-x-auto">
																{JSON.stringify(
																	toolCall.result,
																	null,
																	2
																)}
															</pre>
														</div>
													)}
												</div>
											</div>
										</div>
									))}
							</div>
						))}

						{/* Loading Indicator */}
						{isLoading && (
							<div className="flex justify-start">
								<div className="bg-ttg-black/10 rounded-lg px-4 py-3">
									<div className="flex items-center gap-2">
										<div className="animate-pulse">🤖</div>
										<span className="text-sm">Thinking...</span>
									</div>
								</div>
							</div>
						)}

						<div ref={messagesEndRef} />
					</div>
				</div>

				{/* Input Area */}
				<div className="bg-white border border-gray-200 rounded-lg p-4">
					<div className="flex gap-2">
						<textarea
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Ask me to create tasks, list teams, or manage your workflow..."
							className="flex-1 border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:border-ttg-green"
							rows={2}
							disabled={isLoading}
						/>
						<button
							onClick={handleSendMessage}
							disabled={isLoading || !input.trim()}
							className={`px-6 py-2 rounded-lg font-medium transition-colors ${
								isLoading || !input.trim()
									? 'bg-gray-300 text-gray-500 cursor-not-allowed'
									: 'bg-ttg-green text-white hover:bg-ttg-green/80'
							}`}
						>
							<div className="flex items-center gap-2">
								<span>Send</span>
								<SvgComponent iconName="ARROW_RIGHT" className="w-4 h-4" />
							</div>
						</button>
					</div>

					{/* Quick Actions */}
					<div className="mt-3 flex gap-2 flex-wrap">
						<span className="text-xs text-gray-500">Quick actions:</span>
						<button
							onClick={() =>
								setInput('Create a task called "TASK NAME" with "PRIORITY" priority and description "DESCRIPTION" make sure to use the right id for "username"')
							}
							className="text-xs bg-ttg-black/5 hover:bg-ttg-black/10 px-3 py-1 rounded-full"
						>
							Create task
						</button>
						<button
							onClick={() => setInput('List all my tasks')}
							className="text-xs bg-ttg-black/5 hover:bg-ttg-black/10 px-3 py-1 rounded-full"
						>
							List tasks
						</button>
						<button
							onClick={() => setInput('Create a team called "Backend Team"')}
							className="text-xs bg-ttg-black/5 hover:bg-ttg-black/10 px-3 py-1 rounded-full"
						>
							Create team
						</button>
					</div>
				</div>
			</div>

			{/* Confirmation Modal */}
			<SlideModalContainer
				isOpen={confirmationModal.isOpen}
				close={confirmationModal.close}
				noFade={false}
			>
				<div className="p-6">
					<h2 className="text-2xl font-bold text-ttg-black mb-4">
						⚠️ Confirm Action
					</h2>

					{pendingToolCall && (
						<div className="space-y-4">
							<p className="text-ttg-black">
								The AI assistant wants to perform the following action:
							</p>

							<div className="bg-ttg-purple/10 border border-ttg-purple/30 rounded-lg p-4">
								<h3 className="font-semibold text-ttg-purple mb-2">
									🔧 {pendingToolCall.tool}
								</h3>
								<div className="bg-white rounded p-3">
									<p className="text-sm font-medium mb-2">Parameters:</p>
									<pre className="text-xs overflow-x-auto">
										{JSON.stringify(pendingToolCall.parameters, null, 2)}
									</pre>
								</div>
							</div>

							<div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
								<p className="text-sm text-yellow-800">
									<strong>Note:</strong> This action will modify your data.
									Please review the parameters before approving.
								</p>
							</div>

							<div className="flex gap-3 mt-6">
								<Button
									type="Success"
									text="✓ Approve"
									onClick={handleApproveToolCall}
									className="flex-1"
								/>
								<Button
									type="Danger"
									text="✗ Cancel"
									onClick={handleRejectToolCall}
									className="flex-1"
								/>
							</div>
						</div>
					)}
				</div>
			</SlideModalContainer>
		</HeaderContainer>
	);
}
