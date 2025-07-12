import mongoose, { Schema } from "mongoose";

const walletSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    wallet_id: {
        type: String
    },
    total_received: {
        type: Number,
        default: 0
    },
    total_sent: {
        type: Number,
        default: 0
    }
});

const walletModel = mongoose.model('wallets', walletSchema);
export default walletModel;