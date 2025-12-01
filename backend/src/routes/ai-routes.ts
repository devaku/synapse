import express from 'express';
import {
	chatWithAI,
	streamChat,
	executeToolCall,
	checkHealth,
} from '../controllers/ai-controller';
import { verifyJwt } from '../middlewares/auth-middleware';

const router = express.Router();

// Apply authentication to all AI routes
router.use(verifyJwt);

// Chat endpoints
router.post('/chat', chatWithAI);
router.post('/chat/stream', streamChat);

// Tool execution
router.post('/execute-tool', executeToolCall);

// Health check
router.get('/health', checkHealth);

export default router;
