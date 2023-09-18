import asyncHandler from "express-async-handler";
import Friend from "../model/Friend.js";

export const checkFriendshipStatus = asyncHandler(async(req, userId) => {
    const {id} = req.user
    let status = ''

    const friend = await Friend.findOne({ userId: id }).exec();

    // Check if userId is present in the friends array
    if (friend.friends.includes(userId)) {
        status = 'Friend'
        return status
    }

    // Check if userId is present in the friendReqSent array
    if (friend.friendReqSent.includes(userId)) {
        status = 'Request sent'
        return status 
    }

    // Check if userId is present in the friendReqReceived array
    if (friend.friendReqReceived.includes(userId)) {
        status = 'Request received'
        return status
    }

    // Check if userId is present in the friendReqReceived array
    if (friend.blockedUsers.includes(userId)) {
        status = 'Blocked'
        return status
    }

    // If userId is not present in any of the arrays
    return status
})