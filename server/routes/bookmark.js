import express from 'express';
import { verifyJWT, verifyUser } from '../middleware/verifyJwt.js';
import { addBookmark, getAllBookmarks, removeBookmark } from '../controller/bookmarkController.js';
const bookmarkRouter = express.Router()

bookmarkRouter.get('/fetch', verifyUser, getAllBookmarks)
bookmarkRouter.post('/add/:postId', verifyUser, addBookmark)
bookmarkRouter.put('/remove/:postId', verifyUser, removeBookmark)

export default bookmarkRouter