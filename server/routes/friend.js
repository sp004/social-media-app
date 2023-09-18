import express from 'express';
import { verifyJWT, verifyUser } from '../middleware/verifyJwt.js';
import { acceptRequest, blockUser, getAllFriends, getBlockedUsers, getReqReceivedUsers, getReqSentUsers, getSuggestedUsers, getUnblockedUsers, rejectRequest, sendRequest, unblockUser, unfriend, withdrawRequest } from '../controller/friendController.js';

const friendRouter = express.Router()

//put routes
friendRouter.put('/sentReq', verifyUser, sendRequest)
friendRouter.put('/withdrawReq', verifyUser, withdrawRequest)
friendRouter.put('/unfriend', verifyUser, unfriend)
friendRouter.put('/accept', verifyUser, acceptRequest)
friendRouter.put('/reject', verifyUser, rejectRequest)
friendRouter.put('/block', verifyUser, blockUser)
friendRouter.put('/unblock', verifyUser, unblockUser)

//get routes
friendRouter.get('/allFriends', verifyJWT, getAllFriends)
friendRouter.get('/requestSent', verifyJWT, getReqSentUsers)
friendRouter.get('/requestReceived', verifyJWT, getReqReceivedUsers)
friendRouter.get('/blockedUsers', verifyJWT, getBlockedUsers)
friendRouter.get('/unblockedUsers', verifyJWT, getUnblockedUsers)
friendRouter.get('/suggestions', verifyJWT, getSuggestedUsers)

// friendRouter.get('/checkFriendshipStatus/:userId', verifyUser, checkFriendshipStatus)

export default friendRouter