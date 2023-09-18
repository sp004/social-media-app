import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    postId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:  "Post"
        }
    ]
})

export default mongoose.model('Bookmark', BookmarkSchema)