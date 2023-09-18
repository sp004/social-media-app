import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        // minLength: 90,
        trim: true
    },
    image: {
        type: String,
    },
    bookmarkedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    likedUserIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            message: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date
            }
        }
    ],
    taggedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],
    hashtags: {
        type: Array,
        default: []
    },
    sharedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],
    isEdited: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

export default mongoose.model('Post', PostSchema)