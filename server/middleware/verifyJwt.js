import asyncHandler from "express-async-handler";
import User from "../model/User.js";
import { ErrorHandler } from "./ErrorHandler.js";
import jwt from 'jsonwebtoken'
import util from 'util';

//whether the user is signed in or not
export const verifyJWT = async (req, res, next) => {
  // console.log(req.headers)
  const authHeader = req.headers?.authorization;
  // console.log("ah => ", authHeader)
  try {
      if (authHeader?.startsWith('Bearer ')){
      const token = authHeader.split(' ')[1];
    
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_KEY,
        async (err, decoded) => {
          if (err) return next(ErrorHandler(403, 'Invalid token! Please login again'))//invalid token
    
          // const foundUser = await User.findOne({ _id: decoded.id }).select("-password").exec()
    
          req.user = decoded
          next();
        }
      );
    }else{
      return next(ErrorHandler(401, 'Unauthorized'))
    }
  } catch (error) {
    return next(ErrorHandler(401, 'Unauthorized'))
  }
}

//verify whether the user is verified
export const verifyUser = async (req, res, next) => {
  verifyJWT(req, res, async () => {
    if(!req.user) return 
    
    const user = await User.findOne({ _id: req.user?.id }).exec()
    // console.log(user)
    if (!user?.isVerified) {
      return next(ErrorHandler(403, "You are not verified yet, please verify from settings"))
    } else {
      next()
    }
  })
}

//verify whether the user is verified
export const verifyOwnId = async (req, res, next) => {
  verifyJWT(req, res, async () => {
    if (req.params.userId !== req.user?.id) {
      return next(ErrorHandler(401, "You are not allowed to do"))
    } else {
      next()
    }
  })
}