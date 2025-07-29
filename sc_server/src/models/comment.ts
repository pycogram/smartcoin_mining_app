import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        require: true,
        trim: true
    }
},{ timestamps: true });

const commentModel = mongoose.model('comments', commentSchema);
export default commentModel;