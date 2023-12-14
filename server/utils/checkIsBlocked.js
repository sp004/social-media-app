import asyncHandler from "express-async-handler";
import Friend from "../model/Friend.js";

export const checkIsBlocked = asyncHandler(async(req, userId) => {
    const {id} = req.user
    const user = await Friend.find({userId}).select('blockedUsers')
    const blockedUserIds = user?.flatMap(item => item.blockedUsers.map(String)) // Convert to string
    if(blockedUserIds.includes(id)){
        return true
    }else return false
})

export const isBlockedBy = asyncHandler(async(req) => {
    const {id} = req.user
    const user = await Friend.find({ blockedUsers: id }, 'userId');
    const blockedByIds = user?.map(friend => friend.userId.toString());
    return blockedByIds
})