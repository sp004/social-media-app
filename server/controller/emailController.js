import asyncHandler from 'express-async-handler'
import crypto from 'crypto'
import User from '../model/User.js'
import Token from '../model/Token.js'
import { hashToken } from '../utils/index.js'
import { ErrorHandler } from '../middleware/ErrorHandler.js'
import { sendEmail } from '../utils/sendEmail.js'

export const sendAutomatedEmail = asyncHandler((async (req, res, next) => {
    //getting data from client and will be matching with sendEmail options
    const {subject, to, replyTo, template, url} = req.body

    if(!subject || !to || !replyTo || !template){
        return next(ErrorHandler(400, 'Email parameters missing'))
    } 

    //get user info to whom email will be sent
    const user = await User.findOne({email: to}).exec()
    if(!user) return next(ErrorHandler(404, 'User not found'))

    const from = process.env.EMAIL_USER
    const name = user.name
    const link = `${process.env.CLIENT_URL}${url}`

    try {
        await sendEmail(subject, to, from, replyTo, template, name, link)
        res.status(200).json({success: true, message: 'Email sent successfully'})
    } catch (error) {
        next(ErrorHandler(500, 'Email not sent, please try again'))
    }
}))


//send user verification token
export const sendVerificationEmail = asyncHandler((async (req, res, next) => {
    const user = await User.findById(req.user.id)
    //check if user exists
    if(!user) return next(ErrorHandler(404, "User not found"))

    //check if user is verified already
    if(user.isVerified) return next(ErrorHandler(400, "user already verified"))

    //delete verificationToken from DB, if there is any
    const token = await Token.findOne({userId: user._id}).exec()
    if(token){
        await token.deleteOne()
    }

    //create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex') + user._id
    console.log("vT", verificationToken)
    
    //hash the verification token before saving
    const hashedToken = hashToken(verificationToken)
    console.log("hT", hashedToken)

    //save the verification token with other details
    await new Token({
        userId: user._id,
        verificationToken: hashedToken,
        createdAt: Date.now(),
        expiredAt: Date.now() + (10 * 60 * 1000)
    }).save()

    //create verification URL to send to client
    const verificationURL = `${process.env.CLIENT_URL}/verify/${verificationToken}`

    //assign sendEmail parameters
    const subject = 'Verify Your Account'
    const to = user.email
    const from = process.env.EMAIL_USER
    const replyTo = "no-reply@meetfrends.com"
    const template = "verification"
    const name = user.fullname
    const link = verificationURL

    //send email 
    try {
        await sendEmail(subject, to, from, replyTo, template, name, link)
        res.status(200).json({message: 'Verification email sent', link: verificationURL})
    } catch (error) {
        console.log(error)
        // next(ErrorHandler(500, 'Email not sent, please try again'))
    }
}))