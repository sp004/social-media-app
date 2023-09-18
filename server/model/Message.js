import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    // conversationId: {
    //     type: String,
    //     required: true,
    // },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        trim: true,
    },
    // readBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User"
    // },
    createdAt: {
        type: Date
    }
})

export default mongoose.model('Message', MessageSchema)