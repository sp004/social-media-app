import express from 'express';
import { verifyJWT, verifyUser } from '../middleware/verifyJwt.js';
import { createConversation, fetchConversations, removeEmptyConversation } from '../controller/conversationController.js';
const conversationRouter = express.Router()

conversationRouter.post('/create', verifyJWT, createConversation)
conversationRouter.delete('/:conversationId', verifyJWT, removeEmptyConversation)
conversationRouter.get('/getConversation', verifyJWT, fetchConversations)

export default conversationRouter