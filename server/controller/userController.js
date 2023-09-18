import User from "../model/User.js"
import asyncHandler from 'express-async-handler'
import { ErrorHandler } from "../middleware/ErrorHandler.js"
import Post from "../model/Post.js"
import Token from "../model/Token.js"
import crypto from 'crypto'
import { hashToken } from "../utils/index.js"
import { sendEmail } from "../utils/sendEmail.js"
import bcrypt from 'bcryptjs'
import BlockedUser from "../model/Conversation.js"
import Friend from "../model/Friend.js"
import Bookmark from "../model/Bookmark.js"
import { checkFriendshipStatus } from "../utils/checkStatus.js"
import { getMutualFriends } from "../utils/getMutualFriends.js"
import { checkIsBlocked } from "../utils/checkIsBlocked.js"

//get profile details of logged in user
export const getUserProfile = asyncHandler(async(req, res, next) => {
    const {username} = req.params
    const user = await User.findOne({username}).select(["-password", "-refreshToken"])
    if(!user) return next(ErrorHandler(404, `Username ${username} does not exist`))

    //get friends of the user
    const friends = await Friend.find({userId: user._id}).populate("friends").select("friends")
    console.log("🌳🌳🌳", friends)
    const status = await checkFriendshipStatus(req, user?._id)
    const mutualFriends = await getMutualFriends(req, user?._id)
    const isBlocked = await checkIsBlocked(req, user?._id)

    res.status(200).json({data: {...user._doc, checkStatus: status, mutualFriends: mutualFriends, isBlocked, friends: friends[0].friends}});
    
    //check status
    // const friend = await Friend.findOne({ userId: req.user.id }).exec();

    // Check if userId is present in the friends array
    // if (friend.friends.includes(user._id)) {
    //   return res.status(200).json({data: {...user._doc, checkStatus: 'Friend'}});
    // }

    // Check if userId is present in the friendReqSent array
    // if (friend.friendReqSent.includes(user._id)) {
    //     // const user = await User.findById(userId)
    //   return res.status(200).json({data: {...user._doc, checkStatus: 'Request sent'} });
    // }

    // Check if userId is present in the friendReqReceived array
    // if (friend.friendReqReceived.includes(user._id)) {
    //   return res.status(200).json({data: {...user, checkStatus: 'Request received'} });
    // }

})

//get a single user data
export const getUser = asyncHandler(async(req, res, next) => {
    // const {username} = req.params
    // const user = await User.findOne({username}).select(["-password", "-refreshToken"])
    // if(!user) return next(ErrorHandler(404, `username ${username} does not exist`))

    // res.status(200).json({user})
})

//get all users who are not blocked
export const getAllUnblockedUsers = asyncHandler(async(req, res, next) => {
    const blockedUsers = await BlockedUser.find({userId: req.user.id}).select(["blockedUsers"])
    const allUsers = await User.find({_id: {$nin: blockedUsers}}).select(["-password", "-refreshToken"])

    if(!allUsers) return next(ErrorHandler(404, 'No users found'))
    res.status(200).json({data: allUsers})
})

//search user with username or fullname
export const searchUser = asyncHandler(async(req, res, next) => {
    const {user} = req.query
    // const keyword = req.query.search 
    // ? {
    //     $or: [
    //         {fullname: {$regex: req.query.search, $options: "i"}},
    //         {email: {$regex: req.query.search, $options: "i"}},
    //     ]
    // }
    // : {};

    const searchedUsers = await User.find({
        fullname: {$regex: user, $options: "i"}
    }).find({_id: {$ne: req.user.id}}) //find all users except logged in user
    if(!searchedUsers) return next(ErrorHandler(404, "No users found"));

    res.status(200).json({data: searchedUsers})
})

//update user data
export const updateUser = asyncHandler(async(req, res, next) => {
    // console.log(req.body)
    const user = await User.findByIdAndUpdate(req.user.id, 
        {$set: req.body},
        {new: true}
    )
// console.log(user)
    res.status(200).json({status: "Success", user, message: "Profile successfully updated"})
})

//deactivate user account
export const deactivateUser = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id)
    if(!user) return next(ErrorHandler(404, "User not found"))

    user.isDeactivated = true
    await user.save()

    res.status(200).json({status: "Success", message: "Account deactivated"})
})

//delete user profile
export const deleteUser = asyncHandler(async(req, res, next) => {
    const {id} = req.user
    const user = await User.findById(id)

    //delete all comments posted by the user
    await Post.updateMany(
        {"comments.userId": id}, 
        {$pull: {comments: {userId: id}}}
    )
    console.log("🤢🤢")
        
        // Remove user ID from likedUserIds array
    await Post.updateMany(
        { likedUserIds: {$in: [id]} },
        { $pull: { likedUserIds: id } }
    );
            
    console.log("🥰🥰")
    // Remove user ID from sharedBy array
    // await Post.updateMany(
    //     { sharedBy: {$in: [id]} },
    //     { $pull: { sharedBy: id } }
    // );

    //delete the posts of the user
    await Post.deleteMany({userId: id})
    console.log("😎😎")
    
    //delete the bookmarks by User
    await Bookmark.deleteOne({userId: id}).exec()
    console.log("🤩🤩")
    
    //remove user id from all the arrays inside Friends collection
    await Friend.updateMany(
        {
            $or: [
                { friends: {$in: [id]} }, 
                { friendReqSent: {$in: [id]} }, 
                { friendReqReceived: {$in: [id]} }, 
                { blockedUsers: {$in: [id]} }, 
            ],
        },
        {
            $pull: {
                friends: {$in: [id]}, 
                friendReqSent: {$in: [id]}, 
                friendReqReceived: {$in: [id]}, 
                blockedUsers: {$in: [id]}, 
            },
        },
        { multi: true } // Set multi option to true to update multiple documents
    )
    console.log("😥😥")
        
    //delete userId from Friends collection
    await Friend.findOneAndDelete({userId: id});
    console.log("🤯🤯")
        
    // Delete the user
    await User.deleteOne({_id: id});
    console.log("😮😮")
        
    res.status(200).json({status: "Success", message: `Account is deleted`})
})


//user will provide email and will get password reset link
export const forgetPwdController = asyncHandler(async(req, res, next) => {
    const { email } = req.body
    console.log(email)
    const user = await User.findOne({ email }).exec()
    if(!user) return next(ErrorHandler(404, "Email not registered"))

    //if user is in DB, then check whether there is resetToken present
    const token = await Token.findOne({userId: user._id}).exec()

    //delete token if already present
    if(token?.resetPwdToken){
        await Token.deleteOne({resetPwdToken: token.resetPwdToken})
    }

    //create new reset token 
    const resetToken = crypto.randomBytes(32).toString('hex') + user._id

    //generate a hashed value of that reset token and save hashed Token to DB
    const hashedResetToken = hashToken(resetToken)

    //save the hashed reset token in DB
    await new Token({
        userId: user._id,
        resetPwdToken: hashedResetToken,
        createdAt: Date.now(),
        expiredAt: Date.now() + (10 * 60 * 1000)
    }).save()

    //create reset password url
    const resetpasswordURL = `${process.env.CLIENT_URL}/reset/${resetToken}`    

    //reset password - Email options
    const subject = "Password Reset Request";
    const to = user.email;
    const from = process.env.EMAIL_USER;
    const replyTo = "no-reply@meetfrend.com";
    const template = "forgetPassword";
    const name = user.name;
    const link = resetpasswordURL;

    //send email
    try {
        await sendEmail(subject, to, from, replyTo, template, name, link)
        res.status(200).json({status: 'Success', message: 'Password Reset email sent', link: resetpasswordURL})
    } catch (error) {
        return next(ErrorHandler(500, 'Email not sent, please try again'))
    }
})


//reset user password, if user forgets it
export const resetpasswordController = asyncHandler(async (req, res, next) => {
    const {password, cPassword} = req.body
    const {resetToken} = req.params
    
    //check if user has entered both the fields
    if(!password || !cPassword) return next(ErrorHandler(400, "All fields are required")) 
    
    //check if both the password and confirm_password are same 
    if(password !== cPassword) return next(ErrorHandler(400, "Both password and confirm password should be matched"))

    //generate hashed value for the resetToken, taken from params
    const hashedResetToken = hashToken(resetToken)

    //check if the hashedResetToken is present in the DB
    const token = await Token.findOne({
        resetPwdToken: hashedResetToken,
        expiredAt: {
            $gt: Date.now()
        }
    })
    if(!token) return next(ErrorHandler(400, 'Token is expired or invalid'))

    //get the user details from the token
    const user = await User.findOne({_id: token.userId})

    //generate the hashed password to store in DB
    const salt = bcrypt.genSaltSync(10)
    const newHashPassword = bcrypt.hashSync(password, salt)

    //save the password in DB
    user.password = newHashPassword
    await user.save()

    res.status(200).json({status: "Success", message: "Passowrd changed successfully"})
})