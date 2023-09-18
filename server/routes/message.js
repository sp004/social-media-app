import express from 'express';
import { verifyJWT, verifyUser } from '../middleware/verifyJwt.js';
import { createMessage, fetchMessages } from '../controller/messageController.js';
const messageRouter = express.Router()

messageRouter.post('/create', verifyUser, createMessage)
messageRouter.get('/getMessage/:conversationId', verifyJWT, fetchMessages)

export default messageRouter