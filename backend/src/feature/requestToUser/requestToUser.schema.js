import mongoose from "mongoose";


export const requestToUserSchema=new mongoose.Schema({
    companyId:{type:mongoose.Schema.Types.ObjectId,ref:"company"},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
    adminId:{type:mongoose.Schema.Types.ObjectId,ref:"roles"},
    note:{type:"String",default:''},
    time:{type:"Date",required:true,default:Date.now()}
});

requestToUserSchema.index({userId:1,companyId:1},{unique:true});