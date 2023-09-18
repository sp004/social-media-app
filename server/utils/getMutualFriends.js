import asyncHandler from "express-async-handler";
import Friend from "../model/Friend.js";

export const getMutualFriends = asyncHandler(async(req, userId) => {
    const loggedInUser = await Friend.findOne({userId: req.user.id}).select("friends")
    const otherUser = await Friend.findOne({userId}).select("friends")

    // console.log("log", loggedInUser)
    // console.log("otehr", otherUser)

    const commonFriends = loggedInUser.friends.filter(friend => 
        otherUser.friends.some(friend2 => friend2._id.equals(friend._id))
    );

    // console.log("common ===>", commonFriends)
    return commonFriends
})
