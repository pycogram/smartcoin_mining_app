import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "first name is required"],
        trim: true,
        lowercase: true
    },
    last_name: {
        type: String,
        trim: true,
        lowercase: true
    },
    user_name: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'email address is required'],
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: [true, 'password is required'],
        select: false,
        trim: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verified_code: {
        type: String,
        select: false
    },
    verified_time: {
        type: Number,
        select: false
    },
    forget_pwdc: {
        type: String,
        select: false
    },
    forget_pwdt: {
        type: Number,
        select: false
    }
}, { timestamps: true });

const userModel = mongoose.model('users', userScheme);
export default userModel;