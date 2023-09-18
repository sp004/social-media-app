import asyncHandler from "express-async-handler";
import { ErrorHandler } from "../middleware/ErrorHandler.js";
import Message from "../model/Message.js";
import Conversation from "../model/Conversation.js";

//------------- create a new message ----------------
export const createMessage = asyncHandler(async(req, res, next) => {
    const newMessage = await Message.create(req.body);

    //set last message of the conversation
    await Conversation.findByIdAndUpdate(req.body?.conversationId, {
        lastMessage: newMessage
    })

    res.status(200).send({data: newMessage})
})

//---------- fetch messages ----------------
export const fetchMessages = asyncHandler(async(req, res, next) => {
    const {conversationId} = req.params
    if(!conversationId) return 
    // console.log(conversationId)
    
    const fetchAllMessages = await Message.find({conversationId})

    if(!fetchAllMessages) return next(ErrorHandler(404, 'Start conversation'));
    res.status(200).send({data: fetchAllMessages})
})