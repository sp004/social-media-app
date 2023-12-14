import asyncHandler from "express-async-handler";
import { ErrorHandler } from "../middleware/ErrorHandler.js";
import Post from "../model/Post.js";

//create comment
export const createComment = asyncHandler(async(req, res, next) => {
    const {postId} = req.params

    const post = await Post.findOne({_id: postId})
    if(!post) return next(ErrorHandler(404, 'Post not found'))

    const newComment = {
        userId: req.user.id,
        message: req.body?.message,
        createdAt: req.body?.createdAt
    }

    await post.updateOne({
        $push: {comments: newComment}
    })
    
    res.status(200).json({data: post})
})

//delete comment
export const deleteComment = asyncHandler(async(req, res, next) => {
    const {commentId, postId} = req.params

    const post = await Post.findOneAndUpdate(
        { _id: postId, "comments._id": commentId },
        { $pull: { comments: { _id: commentId } } },
        { new: true }
      );
    if(!post) return next(ErrorHandler(404, 'Post or comment not found'))

    res.status(200).json({data: post, message: 'Comment deleted'})
})