import mongoose, { Schema } from "mongoose";

const bookMarkSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

const bookMarkModel = mongoose.model('comments', bookMarkSchema);
export default bookMarkModel;