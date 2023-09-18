import asyncHandler from "express-async-handler";
import Post from "../model/Post.js";
import { ErrorHandler } from "../middleware/ErrorHandler.js";
import Friend from "../model/Friend.js";
import { isBlockedBy } from "../utils/checkIsBlocked.js";

//create new post
export const createPost = asyncHandler(async (req, res, next) => {
    const hashtags = req.body?.content.match(/#\S+/g);
    // console.log(req.body)

    const newPost = await Post.create({
        content: req.body?.content,
        userId: req.body?.userId,
        image: req.body?.image,
        hashtags
    })

    const mentionedUsers = req.body?.mention?.split(" ").map(item => item.match(/[^(]+(?=\))/g)).flat().filter(Boolean)
    // console.log(mentionedUsers)
    if(mentionedUsers?.length < 0 ) return 

    //check if the user is already mentioned
    const existingTaggedUsers = await Post.findOne({ _id: newPost._id, taggedUsers: { $in: mentionedUsers } }).lean()
    !existingTaggedUsers && await newPost.updateOne({
        $push: {
            taggedUsers: {$each: mentionedUsers}
        }
    })
    res.status(201).json({post: newPost, message: 'New post created'})
})

//get all posts except blocked users and who have blocked the loggined user
export const getAllPosts = asyncHandler(async (req, res, next) => {
    const { page } = req.query;
    const blockedUsers = await Friend.findOne({ userId: req.user?.id }).select("blockedUsers");
    const blockedUserIds = blockedUsers?.blockedUsers?.map((user) => user.toString());
    const isBlockedByIds = await isBlockedBy(req)

    const combinedBlockedIds = [...new Set(blockedUserIds.concat(isBlockedByIds))]

    const posts = await Post.find({ userId: { $nin: combinedBlockedIds } }).skip((page - 1) * 5).limit(5).sort({createdAt: -1}).populate("userId", "fullname username profilePic").populate("taggedUsers", "fullname username profilePic").populate({
        path: 'comments.userId',
        select: 'username fullname profilePic'
    })
    if(!posts) return next(ErrorHandler(404,'No posts found'))

    res.status(200).json({data: posts, message: 'Posts fetched successfully'})
})

//get all posts of an user
export const getUserPost = asyncHandler(async (req, res, next) => {
    console.log("userId --> ", req?.params?.userId)
    if(!req?.params?.userId) return
    const posts = await Post.find({userId: req?.params?.userId}).sort({createdAt: -1}).populate("userId", "fullname username profilePic").populate("taggedUsers", "fullname username profilePic").populate({
        path: 'comments.userId',
        select: 'username fullname profilePic'
    })
    if(!posts) return next(ErrorHandler(404, 'You haven\'t posted yet!!!'))

    // const taggedPosts = await Post.find({
    //     taggedUsers: {$in: req.user.id}
    // }).sort({createdAt: -1}).populate("userId", "fullname username profilePic").populate("taggedUsers", "fullname username profilePic")

    res.status(200).json({data: posts})
})

//get most popular posts
export const getPopularUserPosts = asyncHandler(async (req, res, next) => {
    const posts = await Post.find({userId: req.params.userId})
        .sort({likedUserIds: -1})
        .populate("userId", "fullname username profilePic")
        .populate("taggedUsers", "fullname username profilePic")
        .populate({
            path: 'comments.userId',
            select: 'username fullname profilePic'
        })
    
    if(!posts) return next(ErrorHandler(404, 'You haven\'t posted yet!!!'))
    res.status(200).json({data: posts})
})

//get a particular post
export const getPost = asyncHandler(async (req, res, next) => {
    const postUser = await Post.findById(req.params?.postId, 'userId')
    const blockedUsers = await Friend.findOne({ userId: postUser?.userId }).select("blockedUsers");
    const blockedUserIds = blockedUsers?.blockedUsers?.map((user) => user.toString());
    console.log("🥗", blockedUserIds)

    const post = await Post.findById(req.params?.postId).populate("userId", "fullname username profilePic").populate("taggedUsers", "fullname username profilePic").populate({
        path: 'comments.userId',
        select: 'username fullname profilePic'
    })
    if(!post) return next(ErrorHandler(404, 'No posts yet!!!'))
    const postWithBlockedUsers = {
        ...post.toObject(),
        userId: {
          ...post.userId.toObject(),
          blockedUsers: blockedUserIds
        }
      };
    console.log("🤠", postWithBlockedUsers)
    res.status(200).json({data: postWithBlockedUsers})
})

//get top used hashtags
export const getPopularHahtags = asyncHandler(async (req, res, next) => {
    const hashtags = await Post
        .aggregate([
            { $unwind: "$hashtags" },
            {
              $group: {
                _id: "$hashtags",
                count: { $sum: 1 }
              }
            },
            {
              $project: {
                _id: 0,
                tag: "$_id",
                number: "$count"
              }
            }
        ]).limit(5)

    res.status(200).json({data: hashtags})
})

//posts filtered by hashtag
export const postByHashtag = asyncHandler(async (req, res, next) => {
    const query = '#' + req.query?.hashtag
    
    const posts = await Post.find({
        hashtags: {$in: query}
    }).sort({createdAt: -1}).populate("userId", "fullname username profilePic").populate("taggedUsers", "fullname username profilePic")

    res.status(200).json({data: posts})
})

//posts filtered by hashtag
export const getTaggedPost = asyncHandler(async (req, res, next) => {
    const posts = await Post.find({
        taggedUsers: {$elemMatch: {$eq: req.user.id}}
    }).sort({createdAt: -1}).populate("userId", "fullname username profilePic").populate("taggedUsers", "fullname username profilePic").populate({
        path: 'comments.userId',
        select: 'username fullname profilePic'
    })
    // console.log(posts)
    res.status(200).json({data: posts})
})

//edit post
export const updatePost = asyncHandler(async (req, res, next) => {
    const {postId} = req.params
    console.log(req?.body)
    const updatedPost = await Post.findByIdAndUpdate(postId, 
        {$set: {
            ...req.body,
            hashtags: req.body?.content.match(/#\S+/g)
        }},
        {new: true}
    )
    updatedPost.isEdited = true
    await updatedPost.save() 

    res.status(200).json({data: updatedPost, message: 'Post has been successfully updated'})
})

//@DESC - like post
export const likePost = asyncHandler(async(req, res, next) => {
    const {postId} = req.params
    const {id} = req.user

    const post = await Post.findById(postId);
    if(!post) return next(ErrorHandler(404, 'Post not found'))
    // console.log(post)
    //if the loggedin userId is not present in the likedUserIds list
    // if(!post.likedUserIds.includes(id)){
        await post.updateOne({$push: {likedUserIds: id}})
    // }
console.log("liked")
    res.status(200).json({message: 'Liked'})
})

//remove like
export const removeLike = asyncHandler(async(req, res, next) => {
    const {postId} = req.params
    const {id} = req.user

    const post = await Post.findById(postId);
    if(!post) return next(ErrorHandler(404, 'Post not found'))

    //if the loggedin userId is not present in the likedUserIds list
    // if(post.likedUserIds.includes(id)){
        await post.updateOne({$pull: {likedUserIds: id}})
    // }

    res.status(200).json({message: 'Remove like'})
})

//delete post
export const deletePost = asyncHandler(async (req, res, next) => {
    console.log(req.params?.postId)
    const post = await Post.findById(req.params?.postId)
    if(!post) return next(ErrorHandler(404, 'Post not found'))

    await post.deleteOne()
    res.status(200).json({message: 'Post deleted successfully'})

    //delete the post present in bookmarks
    // await Post.updateMany({"comments.userId": id}, 
    //     {$pull: {userId: id}}
    // )
})


// const arr = [
//     {
//         id: 1,
//         name: 'John',
//         tags: ['as', 'rt', 'op']
//     },
//     {
//         id: 2,
//         name: 'Jon',
//         tags: ['as', 'qw', 'yu']
//     },
//     {
//         id: 3,
//         name: 'Joe',
//         tags: ['kl', 'rt', 'yu']
//     },
//     {
//         id: 4,
//         name: 'Johnny',
//         tags: ['cv', 'qw', 'nm']
//     },
// ]

