import mongoose, { Schema } from "mongoose";

const referralSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    ref_link: {
        type: String,
        required: true,
        lowercase: true
    },
    claim_bonus: {
        type: Number,
        default: 0
    },
    total_bonus: {
        type: Number,
        default: 0
    },
    ref_no: {
        type: Number,
        default: 0
    },
    upline_link: {
        type: String,
        trim: true,
        lowercase: true
    },
    upline_gain: {
        type: Number,
    }
});
const referralModel = mongoose.model('referrals', referralSchema);
export default referralModel;