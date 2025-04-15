import mongoose  from "mongoose";

export const comment=new mongoose.Schema({
    rating:{type:Number,require:true,min:1,max:5},
    msg:{type:String,require:true,default:""},
    byWhomId:{type:mongoose.Schema.Types.ObjectId,ref:"roles",require:true,index:true},
    toWhomId:{type:mongoose.Schema.Types.ObjectId,ref:"roles",require:true,index:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"users",require:true},
    time:{type:Date,require:true,default:Date.now},
});

comment.index({byWhomId:1,toWhomId:1});