import express from 'express';
import { loginUser, logoutUser, registerUser, verifyUserController } from '../controller/authController.js';
const authRouter = express.Router()

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)
authRouter.patch('/verify/:verificationToken', verifyUserController)
authRouter.get('/logout', logoutUser)

// authRouter.get('/refresh', verifyUserController)

export default authRouter