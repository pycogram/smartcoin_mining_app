import mongoose, { Schema } from "mongoose";

const likeSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        required: true
    },
});

const likeModel = mongoose.model('likes', likeSchema);
export default likeModel;