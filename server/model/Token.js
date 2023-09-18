import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    verificationToken: {
        type: String,
        default: '',
    },
    resetPwdToken: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: '',
    },
    expiredAt: {
        type: Date,
        default: '',
    }
})

export default mongoose.model('Token', TokenSchema)