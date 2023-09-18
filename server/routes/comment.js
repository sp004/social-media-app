import express from 'express';
import { verifyUser } from '../middleware/verifyJwt.js';
import { createComment, deleteComment } from '../controller/commentController.js';

const commentRouter = express.Router()

commentRouter.put('/add/:postId', verifyUser, createComment)
commentRouter.put('/remove/:postId/:commentId', verifyUser, deleteComment)

export default commentRouter