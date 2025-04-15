import mongoose from "mongoose";

export const otpSchema = new mongoose.Schema({
    otp:{type:Number,required:true},
    email:{type:String,required:true,match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,'Please enter a valid email'],index:true,unique:true},
    createdAt:{type:Date,default:Date.now,expires:300}
});