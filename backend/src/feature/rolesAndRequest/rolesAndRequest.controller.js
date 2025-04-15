import { customError } from "../../middlewares/error.middleware.js";
import { requestRepository } from "./request.repository.js";
import { rolesRepository } from "./roles.repository.js";
import { companyRepository } from "../company/company.repository.js";
import { commentRepository } from "../comment/comment.repository.js";
import { notificationRepository } from "../notifications/notifications.repository.js";

import jwt from "jsonwebtoken";

const isValidObjectId = (id) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;  
    return objectIdPattern.test(id);
};


export class rolesAndRequestController{
    constructor(){
        this.requestRepository=new requestRepository();
        this.rolesRepository=new rolesRepository();
        this.companyRepository=new companyRepository();
        this.commentRepository=new commentRepository();
        this.notificationRepository=new notificationRepository();
    }
    addNewRole=async (req,res,next)=>{
        try{
        //triming for the all elements for the req.body
        for(const key in req.body){
            if (typeof req.body[key] === 'string') {req.body[key]=req.body[key].trim();}
        }
        const {companyName,role, companyId,about,note}=req.body;
        const {userId}=req.userData;
        if(role==="admin"){
            let company=await this.companyRepository.add(companyName,userId,about);
            let admin=await this.rolesRepository.addNewRole(role,userId,company._id,companyName);
            company.adminId.push(admin._id);
            company.save();
            await this.notificationRepository.add(userId,"Created company sucessfully",companyName);
            res.status(201).send({status:true,msg:"created organisation sucessfully, you are the admin"});
        }
        else if(role==="employee"){
            const company=await this.companyRepository.getCompanyByShortComapyId(companyId);
            if(!company){throw new customError(400,"organisation has not found")}
            if(await this.rolesRepository.findEmployeeUsingUserIdInCompany(userId,company._id)){
                throw new customError(400,"your are aldready in the organisation");
            }
            if(await this.requestRepository.findRequestUsingUserIdInCompany(userId,company._id)){
                throw new customError(400,"your request is aldready recived to that organisation, please wait admin to accept for that organisation");
            }
            //create the request in this process
            await this.requestRepository.addRequest(userId,company._id,company.companyName,note);
            res.status(201).send({status:true,msg:"request to be in the organisation is sucessfully made"});
        }
        else{
            throw new customError(400,"please check the role properly");
        }
        }catch(err){
            next(err);
        }
    }

    dataOfUserRoles=async (req,res,next)=>{
        try{
            const roles=await this.rolesRepository.dataOfUserRoles(req.userData.userId);
            res.json({status:true,roles:roles});
        }
        catch(err){
            next(err);
        }
    }
    dataOfUserRequests=async (req,res,next)=>{
        try{
            const roles=await this.requestRepository.dataOfUserRequests(req.userData.userId);
            res.json({status:true,roles:roles});
        }
        catch(err){
            next(err);
        }
    }
    dataOfRequestsToCompany=async (req,res,next)=>{
        try{
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            //should handle when the admin is removed when he is logined
            if(!companyId&&!(role=="admin"||role=="both")){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
            const request=await this.requestRepository.getAllRequestsRelatedToCompanyID(companyId);
            res.json({request});
        }
        catch(err){
            next(err);
        }
    }
    changeRequestToRole=async (req,res,next)=>{
        try{
            const requestId=req.body.requestId;
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            //should handle when the admin is removed the another admin when he is logined
            if(!companyId&&!(role=="admin"||role=="both")){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
            if(!requestId){
                throw  new customError(400,"please provide the requestId");
            }
            const request=await this.requestRepository.getElementByIdAndDelete(requestId);
            await this.rolesRepository.changeRequestToRole(request);
            await this.notificationRepository.add(request.userId,"Your request is accepted",request.companyName);
            res.json({status:true,msg:"sucessfuly cahnged request to role"});
        }catch(err){
            next(err);
        }
    }
    revertRequest=async (req,res,next)=>{
        try{
            const requestId=req.body.requestId;
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            //should handle when the admin is removed the another admin when he is logined
            if(!companyId&&!(role=="admin"||role=="both")){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
            if(!requestId){
                throw  new customError(400,"please provide the requestId");
            }
            const request=await this.requestRepository.deleteRequest(requestId);
            await this.notificationRepository.add(request.userId,"Your request is rejected",request.companyName);
            res.json({status:true,msg:"sucessfuly, remove the request"});
            
        }catch(err){
            next(err);
        }
    }
    dataOfEmployees=async (req,res,next)=>{
        try{
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            //should handle when the admin is removed when he is logined
            if(!companyId&&!(role=="admin"||role=="both")){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
            const employees=await this.rolesRepository.dataOfEmployees(companyId);
            res.json({status:true,data:employees});
        }
        catch(err){
            next(err);
        }
    }
    changeAdminToEmployee=async (req,res,next)=>{
        try{
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            const roleId=req.userData.roleId;
            //should handle when the admin is removed when he is logined
            if(!companyId&&!(role=="admin")&&!roleId){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
        
            if(await this.rolesRepository.changeAdminToEmployee(roleId)){
                req.userData.cookieData["role"]="both";
                var token=jwt.sign(req.userData.cookieData, process.env.jwt);
                res.cookie(process.env.cookieNameUserCredientails,token,{maxAge: parseInt(process.env.expoireOfCookieUserCredientails)});
                res.json({status:true,msg:"sucessfuly changed admin to admin and employee"});
            }
            else{
                throw new customError(400,"you may be aldready employee and admin , or roleid is in correct");
            }
        }catch(err){
            next(err);
        }
    }
    getAllowedCommentUserDetails=async (req,res,next)=>{
        try{
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            const roleId=req.userData.roleId;
            let data;
            if(!companyId&&!(role=="employee"||role=="both")){
                throw new customError(400,"please change the role to employee to get the details");
            }
            let b=await this.companyRepository.getCompanyOptions(companyId);
            b=b["EachOtherComments"];
            if(b){
                data=await this.rolesRepository.getDetaisOfEmployeesOfCommentersUsingCompanyId(companyId,roleId);
            }
            else{
                data=await this.rolesRepository.getDetaisOfEmployeesOfCommenters(roleId);
            }
            res.json({status:true,data:data});
        }
        catch(err){
            next(err);
        }
    }
    changeRole=async (req,res,next)=>{
        try{
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            const roleId=req.userData.roleId;
            const newRole=req.body["role"];
            const roledIDC=req.body["roleId"];
            //should handle when the admin is removed when he is logined
            if(!companyId&&!(role=="admin"||role=="both")&&!(newRole=="employee"||newRole=="both")){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
            if(!newRole||!roledIDC){
                throw new customError(400,"please provide the newRole and newRoleId");
            }
            const roleC=await this.rolesRepository.changeRole(roledIDC,newRole,companyId);
            if(roleC){
                if(newRole=="employee"){
                    await this.companyRepository.changeAdminRole(roledIDC,companyId,"-");
                    await this.notificationRepository.add(roleC.userId,"Your role is changed to employee",roleC.companyName);
                }
                else{
                    await this.companyRepository.changeAdminRole(roledIDC,companyId,"+");
                    await this.notificationRepository.add(roleC.userId,"Your role is changed to admin and employee",roleC.companyName);
                }
                res.json({status:true,msg:"sucessfuly changed role"});
            }else{
                throw new customError(400,"please check the newRoleId or login details");
            }
        }
        catch(err){
            next(err);
        }
    }
    deleteRole=async (req,res,next)=>{
        try{
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            const roledIDC=req.body["roleId"];
            //should handle when the admin is removed when he is logined
            if(!companyId&&!(role=="admin"||role=="both")){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
            if(!roledIDC||!isValidObjectId(roledIDC)){
                throw new customError(400,"please provide the RoleId");
            }
            const roleC=await this.rolesRepository.deleteRole(roledIDC,companyId);
            if(roleC){
                await this.commentRepository.deleteAllCommentsOfUser(roledIDC);
                await this.notificationRepository.add(roleC.userId,"You were removed from the origination",roleC.companyName);
                res.json({status:true,msg:"sucessfuly deleted role"});
            }else{
                throw new customError(400,"please check the newRoleId or login details");
            }
        }
        catch(err){
            next(err);
        }
    }
    DataOfEmployeeUsingCompanyIdAndpermissionGivenOne=async (req,res,next)=>{
        try{
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            const reqRoleId=req.query["r"];
            //should handle when the admin is removed when he is logined
            if(!companyId&&!(role=="admin"||role=="both")){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
            const data1=await this.rolesRepository.DataOfEmployeeOfpermissionGivenOne(reqRoleId);
            const data2=await this.rolesRepository.getDetaisOfEmployeesOfCommentersUsingCompanyId(companyId,reqRoleId);
            if(!data1||!data2){
                throw new customError(400,"please check the roleId or login details");
            }

            res.json({status:true,data:{allowedtoComment:data1.allowedtoComment,employees:data2}});
        }
        catch(err){
            next(err);
        }
    }
    changePermissionOfEmployee=async (req,res,next)=>{
        try{
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            const reqRoleId=req.body["roleId"];
            const allowedtoComment=req.body["allowedtoComment"];
            const method=req.body["method"];
            //should handle when the admin is removed when he is logined
            if(!companyId&&!(role=="admin"||role=="both")){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
            if(!reqRoleId||!allowedtoComment||!method||!isValidObjectId(reqRoleId)||!isValidObjectId(allowedtoComment)){
                throw new customError(400,"please provide the roleId and allowedtoComment");
            }
            let roleC;
            if(method=="add"){
                roleC=await this.rolesRepository.addEmployeeChangePermission(reqRoleId,companyId,allowedtoComment);
            }
            else if(method=="remove"){
                roleC=await this.rolesRepository.removeEmployeeChangePermission(reqRoleId,companyId,allowedtoComment);
            }
            if(roleC){
                res.json({status:true,msg:"sucessfuly changed permission"});
            }else{
                throw new customError(400,"please check the roleId or login details");
            }
        }
        catch(err){
            next(err);
        }
    }
    changenoOfCommentsAllowedbyAdmin=async (req,res,next)=>{
        try{
            const companyId=req.userData.companyId;
            const role=req.userData.role;
            const noOfComments=req.body["noOfComments"];
            const reqRoleId=req.body["roleId"];
            //should handle when the admin is removed when he is logined
            if(!companyId&&!(role=="admin"||role=="both")){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
            if(!noOfComments||noOfComments<0){
                throw new customError(400,"please provide the noOfComments");
            }
            const roleC=await this.rolesRepository.noOfCommentsAllowedChangeByAdmin(reqRoleId,companyId,noOfComments);
            if(roleC){
                res.json({status:true,msg:"sucessfuly changed no of comments allowed"});
            }else{
                throw new customError(400,"please check the roleId or login details");
            }
        }
        catch(err){
            next(err);
        }
    }
}