import express from 'express';
import { sendVerificationEmail } from '../controller/emailController.js';
import { deactivateUser, deleteUser, forgetPwdController, getAllUnblockedUsers, getUser, getUserProfile, resetpasswordController, searchUser, updateUser } from '../controller/userController.js';
import { verifyJWT, verifyUser } from '../middleware/verifyJwt.js';
const userRouter = express.Router()

userRouter.post('/forget-password', forgetPwdController)
userRouter.post('/reset-password/:resetToken', resetpasswordController)

userRouter.get('/profile/:username', verifyJWT, getUserProfile) //fetch profile 
userRouter.get('/unblockedUsers', verifyJWT, getAllUnblockedUsers) 
userRouter.get('/:username', getUser) //fetch user's profile
userRouter.get('/', verifyJWT, searchUser) 
userRouter.put('/edit', verifyUser, updateUser)
userRouter.put('/deactivate', verifyJWT, deactivateUser)
userRouter.delete('/delete', verifyJWT, deleteUser)

userRouter.post('/verification', verifyJWT, sendVerificationEmail)

export default userRouter