import express from 'express';
import { createPost, deletePost, getAllPosts, getPopularHahtags, getPopularUserPosts, getPost, getTaggedPost, getUserPost, likePost, postByHashtag, removeLike, updatePost } from '../controller/postController.js';
// import upload from '../Aws.js';
import { verifyJWT, verifyUser } from '../middleware/verifyJwt.js';
const postRouter = express.Router()

postRouter.post('/create', verifyUser, createPost)
postRouter.get('/find/:postId', getPost)
postRouter.get('/allPosts', verifyJWT, getAllPosts)
postRouter.get('/userPosts/:userId', verifyJWT, getUserPost)
postRouter.get('/popularUserPosts/:userId', verifyJWT, getPopularUserPosts)
postRouter.get('/topHashtags', verifyJWT, getPopularHahtags)
postRouter.get('/postByHashtags', verifyJWT, postByHashtag)
postRouter.get('/tagged', verifyUser, getTaggedPost)
postRouter.put('/like/:postId', verifyUser, likePost)
postRouter.put('/dislike/:postId', verifyUser, removeLike)
// postRouter.post('/upload', verifyUser, upload.single('image'), (req, res) => {
//     console.log(req.file.location);
// });
  
postRouter.patch('/edit/:postId', verifyUser, updatePost)
postRouter.delete('/delete/:postId', verifyUser, deletePost)

export default postRouter