import asyncHandler from "express-async-handler";
import Bookmark from "../model/Bookmark.js";
import { ErrorHandler } from "../middleware/ErrorHandler.js";
import Post from "../model/Post.js";
import User from "../model/User.js";

export const getAllBookmarks = asyncHandler(async(req, res, next) => {
    let bookmarks = await Bookmark.find({userId: req.user.id}).populate("postId")
    bookmarks = await User.populate(bookmarks, {
        path: "postId.userId", 
        select: "fullname username profilePic"
    })
    bookmarks = await User.populate(bookmarks, {
        path: "postId.taggedUsers", 
        select: "fullname username profilePic"
    })
    bookmarks = await User.populate(bookmarks, {
        path: "postId.comments.userId", 
        select: "fullname username profilePic"
    })

    if(!bookmarks) return next(ErrorHandler(404, "No bookmarks yet"))

    res.status(200).json({data: bookmarks})
})

export const addBookmark = asyncHandler(async(req, res, next) => {
    const {postId} = req.params

    // const bookmarkedPost = await Bookmark.findOneAndUpdate(
    //     { userId: req?.user?.id },
    //     { $push: { postId } },
    //     { new: true }
    // );

    // await Post.findOneAndUpdate(
    //     {_id: postId},
    //     { $push: {bookmarkedBy: req?.user?.id} },
    //     {new: true}
    // )

    const bookmark = await Bookmark.findOne({userId: req.user.id})

    if(bookmark){
        bookmark.postId.push(postId) 
        await bookmark.save()
    }else{
        const newBookmark = await Bookmark.create({userId: req.user.id, postId: [postId]})
        if(!newBookmark) return next(ErrorHandler(400, "Failed to add bookmark"));
        await newBookmark.save()
    }

    await Post.findOneAndUpdate(
        {_id: postId},
        { $push: {bookmarkedBy: req?.user?.id} },
        {new: true}
    )

    return res.status(201).json({ message: "Bookmarked", status: 'Success' });
})

export const removeBookmark = asyncHandler(async(req, res, next) => {
    const { postId } = req.params;

    await Bookmark.findOneAndUpdate(
        { userId: req?.user.id },
        { $pull: { postId } },
        { new: true }
    );

    await Post.findOneAndUpdate(
        {_id: postId},
        { $pull: {bookmarkedBy: req?.user.id} },
        {new: true}
    )

    // const bookmark = await Bookmark.findOne({ userId: req.user.id });
    // if(!bookmark) return next(ErrorHandler(404, "No bookmarks found"))

    // bookmark.postId = bookmark.postId.filter((id) => id.toString() !== postId);
    // await bookmark.save()

    res.status(200).json({message: "Bookmark removed", status: 'Success'})
})