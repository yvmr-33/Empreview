import { comment } from "./comment.schema.js";
import mongoose  from "mongoose";
import { customError } from "../../middlewares/error.middleware.js";
import {ObjectId} from "mongodb";

const commentModel=mongoose.model("comments",comment);

export class commentRepository{
    add=async(rating,msg,byWhomId,toWhomId,userId)=>{
        try{
            const newComment=new commentModel({
                rating:rating,
                msg:msg,
                byWhomId,
                toWhomId,
                userId
            });
            await newComment.save();
            return newComment;
        }catch(err){
            throw new customError(400,"something went wrong while adding the comment");
        }
    }
    countTheCommentsOfUserToUser=async(byWhomId,toWhomId)=>{
        try{
            const count=await commentModel.countDocuments({byWhomId,toWhomId});
            return count;
        }catch(err){
            throw new customError(400,"something went wrong while counting the comments");
        }
    }
    privateCommentsWithoutNames=async(toWhomId)=>{
        try{
            const comments=await commentModel.find({toWhomId},"rating msg -_id").sort({ time: -1 });
            const newComments =comments.map(comment=>{
                return {...comment.toObject(),name:"private comments"};
            })
            return newComments;
        }catch(err){
            throw new customError(400,"something went wrong while getting the comments");
        }
    }
    allCommentMsg=async(toWhomId)=>{
        try{
            const comments=await commentModel.aggregate([  
                {
                    $match:{
                        toWhomId:new ObjectId(toWhomId)
                    }
                },
                { $sort: { time: -1 } },
                {
                    "$lookup":{
                        "from":"users",
                        "localField":"userId",
                        "foreignField":"_id",
                        "as":"user"
                    }
                },
                {
                    "$unwind":"$user"
                },
                {
                    "$project":{
                        "rating":1,
                        "msg":1,
                        "name":"$user.name",
                    }
                }
            ]);

            return comments;
        }catch(err){

        }
    }
    showSamebyWhomIdandtoWhomId=async(byWhomId,toWhomId)=>{
        try{
            let comments=await commentModel.find({byWhomId,toWhomId},"rating msg -_id").sort({ time: -1 });
            const newComments =comments.map(comment=>{
                return {...comment.toObject(),name:"By You"};
            })
            return newComments;
        }catch(err){
            throw new customError(400,"something went wrong while getting the comments");
        }
    }
    deleteComment=async(id)=>{
        try{
            const comment=await commentModel.findByIdAndDelete(id);
            return comment;
        }catch(err){
            throw new customError(400,"something went wrong while deleting the comment");
        }
    }
    updateCommet=async(id,rating,msg)=>{
        try{
            const comment=await commentModel.findByIdAndUpdate({_id:id},{rating,msg});
            return comment;
        }
        catch(err){
            throw new customError(400,"something went wrong while updating the comment");
        }
    }
    deleteAllCommentsOfUser=async(id)=>{
        try{
            const comment=await commentModel.deleteMany({toWhomId:id});
            return comment;
        }catch(err){
            throw new customError(400,"something went wrong while deleting the comment");
        }
    }
}