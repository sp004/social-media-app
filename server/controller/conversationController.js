import asyncHandler from "express-async-handler";
import Conversation from "../model/Conversation.js";
import { ErrorHandler } from "../middleware/ErrorHandler.js";
import Message from "../model/Message.js";

//------------ create new conversation --------------------
export const createConversation = asyncHandler(async(req, res, next) => {
    const senderId = req?.body?.senderId
    const receiverId = req?.body?.receiverId

    //check if conversation with the same receiver already exists or not
    const existingConversation = await Conversation.findOne({
        users: {$all: [senderId, receiverId]}
    })
    // console.log(existingConversation)
    if(existingConversation) return 

    const newConversation = await Conversation.create({
        users: [senderId, receiverId] 
    })
    // console.log("newConversation: ", newConversation)
    if(!newConversation) return next(ErrorHandler(400, 'Cannot create conversation, please try again later'));
    res.status(200).json({data: newConversation})
})

//---------- get conversation --------------------
export const fetchConversations = asyncHandler(async(req, res, next) => {
    const allConversations = await Conversation.find({
        users: {$elemMatch: {$eq: req.user.id}}
    }).populate("users", "-password -refreshToken")
    .populate("lastMessage")
    .sort({updatedAt: -1})
    // console.log(allConversations)
    
    res.status(200).json({data: allConversations})
})


//---------- remove empty conversation --------------------
export const removeEmptyConversation = asyncHandler(async(req, res, next) => {
    const {conversationId} = req.params
// console.log(conversationId)
    const conversation = await Message.find({conversationId})
    const emptyConversation = !conversation.length && await Conversation.findByIdAndDelete(conversationId)
// console.log(emptyConversation)
    res.status(200).json({data: emptyConversation, message: 'Conversation deleted successfully'})
})