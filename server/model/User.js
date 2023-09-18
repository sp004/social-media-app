import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true
    },
    fullname: {
        type: String,
        required: [true, 'Fullname is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: {
            validator: function (value) {
                const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return emailRegex.test(value);
            },
            message: 'Please enter a valid email',
        },
        // match: [
        //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        //     "Please enter a valid email",
        // ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    profilePic: {
        type: String,
        default: "https://i.ibb.co/4pDNDk1/avatar.png"
    },
    coverPic: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isDeactivated: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        min: 60
    },
    refreshToken: {
        type: String,
    }
}, {timestamps: true})

export default mongoose.model('User', UserSchema)