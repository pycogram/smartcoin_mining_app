import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    content: {
        type: String,
        required: [true, "content is required"],
    }
}, { timestamps: true });

const postModel = mongoose.model('posts', postSchema);
export default postModel;