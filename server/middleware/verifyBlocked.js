import Friend from "../model/Friend.js"
import { ErrorHandler } from "./ErrorHandler.js"

//check if the user is in blocked list or not before adding them into sendRequest list
export const verifyBlocked = asyncHandler(async(req, res, next) => {
    const {id} = req.user
    const {userId} = req.params 

    const friend = await Friend.findOne({_id: id}).exec()
    if(friend.blockedUsers.includes(userId)){
        res.status(400).json({message: "You are blocked"})
    }else{
        next()
    }
})