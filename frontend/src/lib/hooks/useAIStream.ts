import { useState, useCallback } from 'react';
import { streamChat } from '../services/api/mcp';
import type { MCPMessage } from '../types/mcp';

interface UseAIStreamResult {
	streamMessage: (messages: MCPMessage[], token: string, onChunk: (chunk: string) => void) => Promise<void>;
	isStreaming: boolean;
	error: string | null;
}

/**
 * Hook for streaming AI responses in real-time
 * This provides a better UX by showing the AI's response as it's generated
 */
export function useAIStream(): UseAIStreamResult {
	const [isStreaming, setIsStreaming] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const streamMessage = useCallback(
		async (
			messages: MCPMessage[],
			token: string,
			onChunk: (chunk: string) => void
		) => {
			setIsStreaming(true);
			setError(null);

			try {
				// Use the async generator from streamChat
				for await (const chunk of streamChat(token, messages)) {
					onChunk(chunk);
				}
			} catch (err: any) {
				console.error('Streaming error:', err);
				setError(err.message || 'Failed to stream response');
				throw err;
			} finally {
				setIsStreaming(false);
			}
		},
		[]
	);

	return {
		streamMessage,
		isStreaming,
		error,
	};
}
