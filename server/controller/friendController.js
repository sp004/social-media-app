import asyncHandler from "express-async-handler";
import { ErrorHandler } from "../middleware/ErrorHandler.js";
import Friend from "../model/Friend.js";
import User from "../model/User.js";
import { getMutualFriends } from "../utils/getMutualFriends.js";
import { checkIsBlocked } from "../utils/checkIsBlocked.js";
// import { checkFriendshipStatus } from "../utils/checkStatus.js";

// sent friend request
// before sending request we need to check if the sender is already present in receiver's friendReqSent list ie receiver has already sent friend request 
// when sender sends friend req to receiver, then receiver will be added to sender's friendReqSent list and sender will be added to receiver's friendReqReceived list
export const sendRequest = asyncHandler(async(req, res, next) => {
    const {id} = req.user
    const {userId} = req.body

    const isAlreadySent = await Friend.find({userId: id, 
        friendReqSent: { $in: [userId] }
    });
    // console.log("sent", isAlreadySent)
    if(isAlreadySent.length) return next(ErrorHandler(400, 'Request already sent'))

    const isAlreadyBlocked = await Friend.findOne({userId: id,
        blockedUsers: { $in: [userId] }
    });
    // console.log("isAlreadyBlocked", isAlreadyBlocked)
    if(isAlreadyBlocked) return next(ErrorHandler(400, 'Already blocked'))

    // add receiver's id to sender's friendReqSent list 
    // const test = await Friend.findOneAndUpdate(id)
    const sender = await Friend.findOneAndUpdate({userId: id}, 
        {$push: {friendReqSent: userId}},
        {new: true, runValidators: true}
    )
    if(!sender) return next(ErrorHandler(404, "Something went wrong"))
    
    //add sender's id to receiver's friendReqReceived list 
    const receiver = await Friend.findOneAndUpdate({userId}, 
        {$push: {friendReqReceived: id}},
        {new: true, runValidators: true}
    )
    if(!receiver) return next(ErrorHandler(404, "User not found"))

    // res.status(200).json({sender: sender.friendReqSent, receiver: receiver.friendReqReceived})
    res.status(200).json({message: "Friend request sent"})
})

// withdraw friend request
export const withdrawRequest = asyncHandler(async(req, res, next) => {
    const {userId} = req.body
    const {id} = req.user

    const isAlreadyWithdrawn = await Friend.findOne({userId: id,
        friendReqSent: { $in: [userId] }
    });
    if(!isAlreadyWithdrawn) return next(ErrorHandler(400, 'Request already withdrawn'))

    //remove receiver's id to sender's friendReqSent list 
    const sender = await Friend.findOneAndUpdate({userId: id}, 
        {$pull: {friendReqSent: userId}},
        {new: true, runValidators: true}
    )
    if(!sender) return next(ErrorHandler(404, "Something went wrong"))

    //remove sender's id to receiver's friendReqReceived list 
    const receiver = await Friend.findOneAndUpdate({userId}, 
        {$pull: {friendReqReceived: id}},
        {new: true, runValidators: true}
    )
    if(!receiver) return next(ErrorHandler(404, "User not found"))

    res.status(200).json({message: "Friend request withdrawn"})
})

// unfriend
///user is already in friends list and needs to be removed from there
export const unfriend = asyncHandler(async(req, res, next) => {
    const {id} = req.user
    const {userId} = req.body

    const isAlreadyFriend = await Friend.findOne({userId: id,
        friends: { $in: [userId] }
    });

    if(!isAlreadyFriend) return next(ErrorHandler(400, 'Already removed from friends list'))

    //remove sender from receiver's friends list and vice versa
    const sender = await Friend.findOneAndUpdate({userId: id}, 
        {$pull: {friends: userId}},
        {new: true, runValidators: true}
    )
    const receiver = await Friend.findOneAndUpdate({userId}, 
        {$pull: {friends: id}},
        {new: true, runValidators: true}
    )
    if(!receiver) return next(ErrorHandler(404, "User not found"))

    res.status(200).json({message: "Both of you aren't friends anymore"})
})

// accept friend request
// when the receiver accepts the req, it will be added to sender's friends list and also removed from sender's friendReqSent list and receiver's friendReqReceived list
export const acceptRequest = asyncHandler(async(req, res, next) => {
    const {id} = req.user
    const {userId} = req.body
    
    const isAlreadyAccepted = await Friend.findOne({userId: id,
        friends: { $in: [userId] }
    });
    // console.log("aceped", isAlreadyAccepted)
    if(isAlreadyAccepted) return next(ErrorHandler(400, 'Already accepted'))

    const isAlreadyRejected = await Friend.findOne({userId: id,
        friendReqReceived: { $in: [userId] }
    });
    if(!isAlreadyRejected) return next(ErrorHandler(400, 'Request already rejected'))

    //add sender into receiver's friends list and vice versa
    const acceptUser = await Friend.findOneAndUpdate({userId: id}, 
        {
            $push: {friends: userId},
            $pull: {friendReqReceived: userId}
        },
        {new: true, runValidators: true}
    )

    const requestSender = await Friend.findOneAndUpdate({userId}, 
        {
            $push: {friends: id},
            $pull: {friendReqSent: id}
        },
        {new: true, runValidators: true}
    )

    res.status(200).json({message: "Friend request accepted"})
})

// reject friend request
// when the receiver rejects the req, it will be added to sender's friends list and also removed from sender's friendReqSent list and receiver's friendReqReceived list
export const rejectRequest = asyncHandler(async(req, res, next) => {
    const {userId} = req.body
    const {id} = req.user

    const isAlreadyFriend = await Friend.findOne({userId: id,
        friends: { $in: [userId] }
    });
    // console.log("isAlreadyFriend", isAlreadyFriend)
    if(isAlreadyFriend) return next(ErrorHandler(400, 'You both are already friend'))
    
    const isAlreadyRejected = await Friend.findOne({userId: id,
        friendReqReceived: { $in: [userId] }
    });
    // console.log("isAlreadyRejected", isAlreadyRejected)
    if(!isAlreadyRejected) return next(ErrorHandler(400, 'Already rejected'))

    //remove receiver's id from sender's friendReqReceived list 
    const rejectUser = await Friend.findOneAndUpdate({userId: id}, 
        {$pull: {friendReqReceived: userId}},
        {new: true, runValidators: true}
    )

    //remove sender's id from receiver's friendReqSent list 
    const requestSender = await Friend.findOneAndUpdate({userId}, 
        {$pull: {friendReqSent: id}},
        {new: true, runValidators: true}
    )
    if(!requestSender) return next(ErrorHandler(404, "User not found"))

    res.status(200).json({message: "Friend request rejected"})
})

// block a friend
export const blockUser = asyncHandler(async(req, res, next) => {
    const {userId} = req.body
    const {id} = req.user

    const isAlreadySent = await Friend.find({userId: id, 
        friendReqSent: { $in: [userId] }
    });
    // console.log("sent", isAlreadySent)
    if(isAlreadySent.length) return next(ErrorHandler(400, 'Request already sent'))

    const isAlreadyBlocked = await Friend.findOne({userId: id,
        blockedUsers: { $in: [userId] }
    });
    // console.log("isAlreadyBlocked", isAlreadyBlocked)
    if(isAlreadyBlocked) return next(ErrorHandler(400, 'Already blocked'))

    const blockedUser = await Friend.findOneAndUpdate({userId: id}, 
        {$push: {blockedUsers: userId}},
        {new: true, runValidators: true}
    )
    if(!blockedUser) return next(ErrorHandler(404, 'user not found'))

    res.status(200).json({message: "User is blocked"})
})

// unblock a friend
export const unblockUser = asyncHandler(async(req, res, next) => {
    const {userId} = req.body
    const {id} = req.user

    // const isAlreadyUnblocked = await Friend.findOne({userId: id,
    //     blockedUsers: { $in: [userId] }
    // });
    // if(!isAlreadyUnblocked) return next(ErrorHandler(400, 'Already unblocked'))

    const unblockedUser = await Friend.findOneAndUpdate({userId: id}, 
        {$pull: {blockedUsers: userId}},
        {new: true, runValidators: true}
    )
    if(!unblockedUser) return next(ErrorHandler(404, 'user not found'))

    res.status(200).json({message: "Unblocked successfully"})
})


// get all friends => unfriend, block
export const getAllFriends = asyncHandler(async(req, res, next) => {
    const {friends} = await Friend.findOne({userId: req.user.id}).select(["friends", "-_id"])
    if(!friends) return next(ErrorHandler(404, "No friends found"))
    // console.log(friends)
    // const userIds = friends?.friends?.map(user => user.friends).flat();

    const friendsData = await Promise.all(friends?.map(async (friendId) => {
        const friends = await User.findById(friendId).select("fullname profilePic username isDeactivated")
        const mutualFriends = await getMutualFriends(req, friendId)
        return{
            mutualFriends,
            ...friends._doc
        }
    })); 
    // console.log(friendsData)

    res.status(200).json({data: friendsData})
})

// get all friends to whom request has been sent => withdraw request
export const getReqSentUsers = asyncHandler(async(req, res, next) => {
    const {friendReqSent} = await Friend.findOne({userId: req.user.id}).select(["friendReqSent", "-_id"])
    if(!friendReqSent) return next(ErrorHandler(404, "You have not sent request to any user yet"))

    const friendsData = await Promise.all(friendReqSent?.map(async (friendId) => {
        const user = await User.findById(friendId).select("fullname profilePic username");
        const mutualFriends = await getMutualFriends(req, friendId)
        return{
            mutualFriends,
            ...user._doc
        }
    })); 

    res.status(200).json({data: friendsData})
})

// get all friends who have sent request => accept, reject
export const getReqReceivedUsers = asyncHandler(async(req, res, next) => {
    const {friendReqReceived} = await Friend.findOne({userId: req.user.id}).select(["friendReqReceived", "-_id"])
    if(!friendReqReceived) return next(ErrorHandler(404, "Friend requests are not received yet"))

    const friendsData = await Promise.all(friendReqReceived?.map(async (friendId) => {
        const user = await User.findById(friendId).select("fullname profilePic username isDeactivated");
        const mutualFriends = await getMutualFriends(req, friendId)
        return{
            mutualFriends,
            ...user._doc
        }
    })); 

    res.status(200).json({data: friendsData})
})

//@desc Get blocked user
//@access public - get all blocked users => unblock
export const getBlockedUsers = asyncHandler(async(req, res, next) => {
    const {blockedUsers} = await Friend.findOne({userId: req.user.id}).select(["blockedUsers", "-_id"])
    if(!blockedUsers) return next(ErrorHandler(404, "Friend requests are not received yet"))

    const blockedUsersData = await Promise.all(blockedUsers?.map(async (friendId) => {
        const user = await User.findById(friendId).select("fullname profilePic username isDeactivated");
        const mutualFriends = await getMutualFriends(req, friendId)
        return{
            mutualFriends,
            ...user._doc
        }
    })); 

    res.status(200).json({data: blockedUsersData})
})

// get all unblocked users
export const getUnblockedUsers = asyncHandler(async(req, res, next) => {
    const {blockedUsers} = await Friend.findOne({userId: req.user.id}).select(["blockedUsers", "-_id"])

    const unblockedUsers = await Friend.find({ userId: { $nin: blockedUsers } });
    if(!unblockedUsers) return next(ErrorHandler(404, "No users found"))

    const unblockedUsersData = await Promise.all(unblockedUsers?.map(async (user) => {
        const users = await User.findById(user?.userId).select("fullname profilePic username isDeactivated"); 
        const isBlocked = await checkIsBlocked(req, user?.userId)
        // console.log("isBlocked ", isBlocked)
        return {
            isBlocked,
            ...users?._doc
        }
    }))
// console.log(unblockedUsersData[0])
    res.status(200).json({data: unblockedUsersData?.filter(Boolean)})
})

// get all suggested users (not present in any lists) => add friend, block
export const getSuggestedUsers = asyncHandler(async(req, res, next) => {
    const {id} = req.user

    const ids = await User.find({_id: {$ne: id}}).select(["_id"])
    const userIds = ids?.map(id => id._id)

    const friends = await Friend.findOne({ userId: id });
    // Extract user IDs from different arrays
    const friendsIds = friends.friends || [];
    const friendReqSentIds = friends.friendReqSent || [];
    const friendReqReceivedIds = friends.friendReqReceived || [];
    const blockedUsersIds = friends.blockedUsers || [];

    // Get unique user IDs
    const uniqueUserIds = [...new Set([...friendsIds, ...friendReqSentIds, ...friendReqReceivedIds, ...blockedUsersIds])];

    const suggestedUsers = userIds?.filter(userId => !uniqueUserIds?.some(id => id.equals(userId)))
    const suggestedUsersInfo = await Promise.all(suggestedUsers?.map(async (user) => 
    {
        const friends = await User.findById(user).select("fullname profilePic username isDeactivated")
        const mutualFriends = await getMutualFriends(req, user?._id)
        const isBlocked = await checkIsBlocked(req, user?._id)
        return{
            mutualFriends,
            isBlocked,
            ...friends._doc
        }
    }))

    res.status(200).json({data: suggestedUsersInfo?.filter(user => !user?.isBlocked)})
})

// get all suggested users (not present in any lists) => add friend, block
// export const getMutualFriends = asyncHandler(async(req, res, next) => {
//     const {id} = req.user;
//     const {userId} = req.params
    
//     const loggedInUser = await Friend.findOne({userId: id}).populate("friends")
//     const otherUser = await Friend.findOne({userId: req.params.userId}).populate("friends")

//     const commonFriends = loggedInUser.friends.filter(friend => 
//         otherUser.friends.some(friend2 => friend2._id.equals(friend._id))
//     );
// })

// get relations b/w 2 users
// export const checkFriendshipStatus = asyncHandler(async(req, res, next) => {
//     const {id} = req.user
//     const {userId} = req.params

//     const friend = await Friend.findOne({ userId: id }).exec();

//     // Check if userId is present in the friends array
//     if (friend.friends.includes(userId)) {
//       return res.status(200).json({ status: "Friend" });
//     }

//     // Check if userId is present in the friendReqSent array
//     if (friend.friendReqSent.includes(userId)) {
//         // const user = await User.findById(userId)
//       return res.status(200).json({ status: "Request sent" });
//     }

//     // Check if userId is present in the friendReqReceived array
//     if (friend.friendReqReceived.includes(userId)) {
//       return res.status(200).json({ status: "Request received" });
//     }

//     // If userId is not present in any of the arrays
//     return res.status(200).json({ status: "" });
// })

