const express = require('express');
const router = express.Router();
const {
  getMyConversation,
  getMessages,
  sendMessage,
  listConversations,
  markAsRead,
} = require('../controllers/chatController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/my-conversation', verifyToken, getMyConversation);
router.get('/conversations', verifyAdmin, listConversations);
router.get('/conversations/:id/messages', verifyToken, getMessages);
router.post('/conversations/:id/messages', verifyToken, sendMessage);
router.patch('/conversations/:id/read', verifyToken, markAsRead);

module.exports = router;
