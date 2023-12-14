import User from "../model/User.js"
import asyncHandler from 'express-async-handler'
import { ErrorHandler } from "../middleware/ErrorHandler.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { hashToken } from "../utils/index.js"
import Token from "../model/Token.js"
import Friend from "../model/Friend.js"

export const registerUser = asyncHandler(async(req, res, next) => {
    const {username, fullname, email, password, cPassword} = req.body

    //check if username is available or not
    const duplicateUsername = await User.findOne({username}).exec()
    if(duplicateUsername) return next(ErrorHandler(400, 'Username already taken'))

    //check if email is already registered
    const duplicateEmail = await User.findOne({email}).exec()
    if(duplicateEmail) return next(ErrorHandler(400, 'Email already registered'))

    //check if password and confirm password are same
    if(password !== cPassword) return next(ErrorHandler(400, 'Password and Confirm password should be same'))

    //password hash 
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    //store user to DB
    const newUser = await User.create({
        username,
        email,
        fullname,
        password: hashedPassword
    })
    
    //refresh token create
    const refreshToken = jwt.sign({ id: newUser._id }, process.env.REFRESH_TOKEN_KEY, { expiresIn: '720m' })
    
    //accesstoken creation with id
    const accessToken = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '2880m' })

    // Send HTTP-only cookie
    res.cookie("token", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
    });
    
    //store refresh token in DB
    newUser.refreshToken = refreshToken;
    await newUser.save();
    
    //add the new user to the friends collection
    await Friend.create({userId: newUser._id})

    const {refreshToken:rt, password:pwd, ...other} = newUser._doc
    res.status(201).json({ user:{...other}, accessToken, message: 'Successfully registered' })
})

// after clicking verify button, this controller will be executed
export const verifyUserController = asyncHandler(async(req, res, next) => {
    const {verificationToken} = req.params

    const hashedToken = hashToken(verificationToken)

    //check if the hashedToken is present in DB and also is not expired yet
    const token = await Token.findOne({
        verificationToken: hashedToken,
        expiredAt: {
            $gt: Date.now()
        }
    })
    if(!token) return next(ErrorHandler(404, 'Token is invalid or already has been expired'))

    //if token is found, then update user's isVerified status from false to true
    const user = await User.findOne({_id: token.userId}).exec()
    if(!user) return next(ErrorHandler(404, 'Please signup'))

    if(user.isVerified) return next(ErrorHandler(400, 'User is already verified'))

    user.isVerified = true
    await user.save()

    res.status(200).json({user, message: 'Your account has been verified.', status: 'Success'})
})


// user login
export const loginUser = asyncHandler(async(req, res, next) => {
    // Check if the user exists with the provided email or username
    const user = await User.findOne({
        $or: [{ email: req.body?.emailOrUsername }, { username: req.body?.emailOrUsername }],
    });
    if(!user) return next(ErrorHandler(404, 'Invalid credentials'));

    //password check
    const passwordMatch = bcrypt.compareSync(req.body.password, user.password)
    if(!passwordMatch) return next(ErrorHandler(404, 'Invalid credentials'))

    //refresh token create
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_KEY, { expiresIn: '720m' })

    //accesstoken creation with id
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '2880m' })

    // Send HTTP-only cookie
    res.cookie("token", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
    });

    user.refreshToken = refreshToken;
    user.isDeactivated = false;
    await user.save();

    const { password, refreshToken:rT, ...other } = user._doc

    res.status(200).json({user: {...other}, accessToken, message: "Login successful"})
})

// logout
export const logoutUser = asyncHandler(async(req, res, next) => {
    const {token} = req.cookies;
    if (!token) return next(ErrorHandler(204, 'Your session has ended, please login again')); //No content
    const refreshToken = token;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true });
        return res.status(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    foundUser.isOnline = false;
    await foundUser.save();
    
    res.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true });
    res.status(200).json({message: "Logout successful"});
})

//* generate a new accessToken from refresh token
export const handleRefreshToken = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.token) return res.status(204).json({message: 'No token found'}); //No content
    const refreshToken = cookies.token;
    // console.log(cookies)

    //with rT, check if the token is present in DB. If yes then retrieve the user
    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser){
        next(ErrorHandler(403, 'Please Login...'))
    }

    //evaluate jwt to generate new access token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, 
        (err, decoded) => {
            console.log("err", err)
            if(err || decoded.id !== foundUser._id) return next(ErrorHandler(403, 'Please Login'))
            
            //accesstoken creation with id
            const accessToken = jwt.sign({ id: foundUser._id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '60s' })
            res.status(200).json({accessToken})
        }
    )
}