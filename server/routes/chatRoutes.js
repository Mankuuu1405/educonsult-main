import express from 'express';
const router = express.Router();
import { getOrCreateChatSession, getMessagesBySessionId } from '../controllers/chatController.js';
import { protect } from '../middlewares/authMiddleware.js';

router.use(protect); // All chat routes are protected

router.post('/session', getOrCreateChatSession);
router.get('/messages/:sessionId', getMessagesBySessionId);

export default router;