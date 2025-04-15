import { commentRepository } from "./comment.repository.js";
import {companyRepository} from "../company/company.repository.js";
import {rolesRepository} from "../rolesAndRequest/roles.repository.js";
import { customError } from "../../middlewares/error.middleware.js";

const isValidObjectId = (id) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;  
    return objectIdPattern.test(id);
};

export class commentController{
    constructor(){
        this.commentRepository =new commentRepository();
        this.companyRepository=new companyRepository();
        this.rolesRepository=new rolesRepository();
    }
    addComment=async (req,res,next)=>{
        try{
            const {msg,rating,toWhomId}=req.body;
            const {userId,companyId, roleId,role}=req.userData;
            if(!rating||!toWhomId||!isValidObjectId(toWhomId)){
                throw new customError(400,"give the proper details");
            }
            if(rating>5||rating<1){
                throw new customError(400,"give the proper rating it should be between 1 to 5");
            }
            const options = await this.companyRepository.getCompanyOptions(companyId);

            const toWhomRole=await this.rolesRepository.getRoleById(toWhomId);
            if(!toWhomRole){
                throw new customError(400,"No role found with the given id");
            }
            if(toWhomRole.companyId!=companyId){
                throw new customError(400,"No role found with the given id");
            }
            if(roleId==toWhomId){
                throw new customError(400,"you can't comment on yourself");
            }
            if(role=="admin"||role=="both"){
                const comment=await this.commentRepository.add(rating,msg,roleId,toWhomId,userId);
                await this.rolesRepository.increseOrDecreseTheRating(toWhomId,rating,"+");
                if(comment){
                    res.status(201).json({status:true,msg:"comment added successfully"});
                    return;
                }
                else{
                    throw new customError(400,"something went wrong while adding the comment");
                }
            }
            
            if(options.NoMoreComments){
                throw new customError(400,"No more new  comments allowed");
            }
            const roleObject=await this.rolesRepository.getRoleById(roleId);
            if(!roleObject){
                throw new customError(400,"No role found with the given id");
            }
            if(!(options.EachOtherComments||roleObject.allowedtoComment.includes(toWhomRole._id))){
                throw new customError(400,"you are not allowed to comment on this role");
            }else{
                if(await this.commentRepository.countTheCommentsOfUserToUser(roleId,toWhomId)>=roleObject.noOfCommentsAllowed){
                    throw new customError(400,"you have reached the maximum number of comments for this user");
                }else{
                    await this.rolesRepository.increseOrDecreseTheRating(toWhomId,rating,"+");
                    await this.commentRepository.add(rating,msg,roleId,toWhomId,userId);
                    res.status(201).json({status:true,msg:"comment added successfully"});
                }            
            }
        }
        catch(err){
            next(err);
        }
    }
    viewComment=async(req,res,next)=>{
        try{
            let toWhomId=req.query["toWhomId"];
            let {companyId,roleId,role}=req.userData;
            const options = await this.companyRepository.getCompanyOptions(companyId);
            if(!toWhomId){
                toWhomId=roleId;
                if(options.userNoComments){
                    res.send({status:true,data:[]});
                }
                else if(options.privateComment){
                    const comments=await this.commentRepository.privateCommentsWithoutNames(toWhomId);
                    res.send({status:true,data:comments});
                }
                else{
                    const comments=await this.commentRepository.allCommentMsg(toWhomId);
                    res.send({status:true,data:comments});
                }
                return;
            }
            else{
                const toWhomRole=await this.rolesRepository.getRoleById(toWhomId);
                if(!toWhomRole||toWhomRole.companyId!=companyId){
                    throw new customError(400,"No role found with the given id");
                }
                if(!isValidObjectId(toWhomId)){
                    throw new customError(400,"give the proper details");
                }
                if(role=="admin"||role=="both"){
                    const comments=await this.commentRepository.allCommentMsg(toWhomId);
                    res.send({status:true,data:comments});
                    return;
                }
                if(options.showNoComments){
                    res.send({status:true,data:[]})
                }
                else if(options.showPrivateComment){
                    const comments=await this.commentRepository.showSamebyWhomIdandtoWhomId(roleId,toWhomId);
                    res.send({status:true,data:comments});
                    return;
                }
                else{
                    const comments=await this.commentRepository.allCommentMsg(toWhomId);
                    res.send({status:true,data:comments});
                    return;
                }
            }

        }
        catch(err){
            next(err);
        }
    }
    updateComnment=async(req,res,next)=>{
        try{
            const {msg,rating,toWhomId,_id}=req.body;
            const {companyId,role}=req.userData;
            if(!rating||!toWhomId||!isValidObjectId(toWhomId)){
                throw new customError(400,"give the proper details");
            }
            if(rating>5||rating<1){
                throw new customError(400,"give the proper rating it should be between 1 to 5");
            }
            const toWhomRole=await this.rolesRepository.getRoleById(toWhomId);
            if(!toWhomRole){
                throw new customError(400,"No role found with the given id");
            }
            if(toWhomRole.companyId!=companyId){
                throw new customError(400,"No role found with the given id");
            }
            if(role!="admin"&&role!="both"){
                throw new customError(400,"you are not allowed to update the comment");
            }
            const comment=await this.commentRepository.updateCommet(_id,rating,msg);
            if(comment){
                await this.rolesRepository.increseOrDecreseTheRating(comment.toWhomId,rating,"-+",1,comment.rating);
                res.status(200).json({status:true,msg:"comment updated successfully"});
                return;
            }
            else{
                throw new customError(400,"something went wrong while updating the comment");
            }
            
        }
        catch(err){
            next(err);
        }
    }
    deleteComment=async(req,res,next)=>{
        try{
            const {toWhomId,_id}=req.body;
            const {companyId,role}=req.userData;
            if(!toWhomId||!isValidObjectId(toWhomId)){
                throw new customError(400,"give the proper details");
            }

            const toWhomRole=await this.rolesRepository.getRoleById(toWhomId);
            if(!toWhomRole){
                throw new customError(400,"No role found with the given id");
            }
            if(toWhomRole.companyId!=companyId){
                throw new customError(400,"No role found with the given id");
            }
            if(role!="admin"&&role!="both"){
                throw new customError(400,"you are not allowed to delete the comment");
            }
            const comment=await this.commentRepository.deleteComment(_id);
            if(comment){
                await this.rolesRepository.increseOrDecreseTheRating(comment.toWhomId,comment.rating,"-");
                res.status(200).json({status:true,msg:"comment deleted successfully"});
                return;
            }
            else{
                throw new customError(400,"something went wrong while deleting the comment");
            }
            
        }
        catch(err){
            next(err);
        }
    }
}