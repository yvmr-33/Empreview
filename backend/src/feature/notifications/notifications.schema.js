import mongoose  from "mongoose";

export const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    msg: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false,
        required: true
    },
    companyName: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now,
        required: true
    }
});