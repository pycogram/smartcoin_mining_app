import mongoose, { Schema } from "mongoose";

const minerSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: "users", 
        required: true
    },
    start_time: {
        type: Date, 
    },
    end_time: {
        type: Date,
    },
    total_mined: {
        type: Number,
        default: 0
    },
    total_locked: {
        type: Number,
        default: 0
    },
    lock_time: {
        type: Date
    },
    unlock_time: {
        type: Date
    }
});

const minerModel = mongoose.model('miners', minerSchema);
export default minerModel;