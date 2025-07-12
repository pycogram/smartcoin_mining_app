import mongoose, { Schema } from "mongoose";

const historySchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    subject: {
        type: String,
        trim: true
    },
    detail: {
        type: String,
        trim: true
    },
    time: {
        type: Date,
        require: true
    }

});

const historyModel = mongoose.model('histories', historySchema);
export default historyModel;