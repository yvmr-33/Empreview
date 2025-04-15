import mongoose from "mongoose";
import { rolesSchema } from "./roles.schema.js";
import { customError } from "../../middlewares/error.middleware.js";
import {ObjectId} from "mongodb";

const rolesModel=mongoose.model("roles",rolesSchema);

export class rolesRepository{
    addNewRole=async (role,userId,companyId,companyName,noOfCommentsAllowed)=>{
        try{
            let newRole;
            if(role==="admin"){
                newRole=await rolesModel.create({role,userId, companyId,companyName});
                await newRole.save();
                
            }
            else{
                newRole=await rolesModel.create({role:"employee",userId,companyId,companyName,noOfCommentsAllowed});
            }
            return newRole;
        }
        catch(err){
            if(err instanceof mongoose.Error.ValidationError){
                let userSendErrors={};
                for(const filed in err.errors){
                    if (err.errors.hasOwnProperty(filed)){
                        userSendErrors[filed]=err.errors[filed].message;
                    }
                }
                throw new customError(400,userSendErrors);
            }
            else{
                throw new customError(400,"something went wrong will creating the employee to organisation or admin to orginisation");
            }
        }
    }
    findEmployeeUsingUserIdInCompany=async (userId,companyId)=>{
        try{
            let role=await rolesModel.findOne({userId,companyId});
            return role;
        }
        catch(err){
            throw new customError(400,"something went wrong while searching for user");
        }
    }
    getRoleById=async (roleId)=>{
        try{
            let role=await rolesModel.findOne({_id:roleId});
            return role;
        }
        catch(err){
            throw new customError(400,"something went wrong while searching for user");
        }
    }
    dataOfUserRoles=async (userId)=>{
        try{
            // const roles=await rolesModel.find({userId},{userId:0,"__v":0}).sort({ time: -1 });
            const roles=await rolesModel.aggregate([
                {
                    "$match":{userId:new ObjectId(userId)}
                },
                {
                    "$sort":{ time: -1 }
                },
                {
                    "$lookup": {
                        from: 'companies',
                        localField: 'companyId',
                        foreignField: '_id',
                        as: 'Data',
                    }
                },
                {
                    "$unwind":"$Data"
                },
                {
                    "$project":{
                        "_id":"$_id",
                        "companyName":"$Data.companyName",
                        "companyPhoto":"$Data.photoPath",
                        "companyAbout":"$Data.about",
                        "role":"$role",
                        "time":"$time",
                    }
                },
            ]);
            return roles;
        }
        catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while computing the roles")
            }
        }
    }
    checkUserIdToAdminId=async (userId,rolesId)=>{
        try{
            const role=await rolesModel.findOne({userId,_id:rolesId});
            if(role){
                if(role.role=="admin"||role.role=="both"){
                    return role;
                }
                else{
                    return null;
                }
            }
            else{
                return null;
            }
        }
        catch(err){
            throw new customError(400,"something went wrong while computing");
        }
    }
    
    findRoleUsingUserIdInCompany=async (userId,companyId)=>{
        try{
            let count=await rolesModel.countDocuments({userId,companyId});
            return count;
        }
        catch(err){
            throw new customError(400,"something went wrong while searching for user");
        }
    }
    changeCompanyNameToCompanyId=async(companyName,companyId)=>{
        try{
            await rolesModel.updateMany({companyId},{$set:{companyName}});
        }
        catch(err){
            throw new customError(400,"something went wrong while changing the name");
        }
    }
    changeRequestToRole=async (request)=>{
        try{
            const company=await increaseCount(request.companyId);
            await this.addNewRole("employee",request.userId,request.companyId,request.companyName,company.options.defaultNoOfComments);
        }catch(err){
            throw new customError(400,"something went wrong changing the role");
        }
    }
    dataOfEmployees=async (companyId)=>{
        try{
            const employees= await rolesModel.aggregate([
                {
                    "$match":{
                        $and: [
                            {"companyId":new ObjectId(companyId)},
                            {
                              $or: [
                                { role: "employee" },
                                { role: "both" }
                              ]
                            }
                          ]
                    }
                },
                {
                "$lookup": {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'Data',
                    }
                },
                {
                    "$unwind":"$Data"
                },
                {
                    "$project":{
                        "name":"$Data.name",
                        "about":"$Data.about",
                        "photo":"$Data.photoPath",
                    }
                }
            ]);
            return employees;
        }
        catch(err){
            throw new customError(400,"something went wrong while computing the employees")
        }
    }
    getTheDataOfEmployee=async (roleId)=>{
        try{
            const employee=await rolesModel.aggregate([
                {
                    "$match":{
                        "_id":new ObjectId(roleId)
                    }
                },
                {
                    "$lookup": {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'Data',
                        }
                    },
                    {
                        "$unwind":"$Data"
                    },
                    {
                        "$project":{
                            "name":"$Data.name",
                            "about":"$Data.about",
                            "photo":"$Data.photoPath",
                            "banner":"$Data.bannerPath",
                            "companyId":"$companyId",
                            "companyName":"$companyName",
                            "role":"$role",
                            "rating":"$rating",
                            "noOfRating":"$noOfRating",
                            "noOfCommentsAllowed":"$noOfCommentsAllowed",
                        }
                    }
            ]);
            return employee;
        }
        catch(err){
            throw new customError(400,"something went wrong while computing the employees")
        }
    }
    changeAdminToEmployee=async (roleId)=>{
        try{
            const role=await rolesModel.findOne({_id:roleId});
            if(!role||role.role=="admin"){
                const company=await increaseCount(role.companyId);
                await rolesModel.updateOne({_id:roleId},{$set:{role:"both",noOfCommentsAllowed:company.options.defaultNoOfComments}});
                return true;
            }
            else{
                return false;
            }
        }
        catch(err){
            throw new customError(400,"something went wrong while changing the role");
        }
    }
    changeRole=async (roleId,change,companyId)=>{
        try{
            const role=rolesModel.findOneAndUpdate({_id:roleId,companyId:companyId},{$set:{role:change}});
            return role;
        }
        catch(err){
            throw new customError(400,"something went wrong while changing the role");
        }
    }
    deleteRoleByCompanyId=async (companyId)=>{
        try{
            await rolesModel.deleteMany({companyId});
        }
        catch(err){
            throw new customError(400,"something went wrong while deleting the role");
        }
    }
    getDetaisOfEmployeesOfCommenters=async (roleId)=>{
        try{
           const employees=await rolesModel.aggregate([
                {
                    "$match":{
                        "_id":new ObjectId(roleId)
                    }
                },
                {
                    "$unwind":"$allowedtoComment"
                },
                {
                    $lookup: {
                        from: "roles",     
                        localField: "allowedtoComment",   
                        foreignField: "_id",        
                        as: "details"           
                    }
                },
                {
                    "$unwind":"$details"
                },
                {
                    $lookup: {
                        from: "users",     
                        localField: "details.userId",   
                        foreignField: "_id",        
                        as: "usersDetails"           
                    }
                },
                {
                    "$unwind":"$usersDetails"
                },
                {
                    "$project":{
                        "_id":0,
                        "name":"$usersDetails.name",
                        "about":"$usersDetails.about",
                        "photo":"$usersDetails.photoPath",
                        "banner":"$usersDetails.bannerPath",
                        "companyId":"$details.companyId",
                        "roleId":"$details._id",
                        "rating":"$details.rating",
                        "noOfRating":"$details.noOfRating",
                    }
                }
            ]);
            return employees;
        }catch(err){
            throw new customError(400,"something went wrong while getting the details of the employees");
        }
    }
    getDetaisOfEmployeesOfCommentersUsingCompanyId=async (companyId,rolesId)=>{

        try{
           const employees=await rolesModel.aggregate([
                {
                    "$match":{
                        $and: [
                            {"companyId":new ObjectId(companyId)},
                            {
                              $or: [
                                { role: "employee" },
                                { role: "both" }
                              ]
                            },
                            {
                                _id:{$not:{ $eq: new ObjectId(rolesId) }}
                            }
                        ],
                        
                    }
                },
                {
                    $lookup: {
                        from: "users",     
                        localField: "userId",   
                        foreignField: "_id",        
                        as: "usersDetails"           
                    }
                },
                {
                    "$unwind":"$usersDetails"
                },
                {
                    "$project":{
                        "_id":0,
                        "name":"$usersDetails.name",
                        "about":"$usersDetails.about",
                        "photo":"$usersDetails.photoPath",
                        "banner":"$usersDetails.bannerPath",
                        "companyId":"$details.companyId",
                        "roleId":"$_id",
                        "rating":"$rating",
                        "noOfRating":"$noOfRating",
                    }
                }
            ]);
            return employees;
        }catch(err){
            throw new customError(400,"something went wrong while getting the details of the employees");
        }
    }
    increseOrDecreseTheRating=async (roleId,rating,method,n=1,extra=0)=>{
        try{
            let role=await rolesModel.findOne({_id:roleId});
            if(!role){
                throw new customError(400,"No role found with the given id");
            }
            let newRating,noOfRating;
            if(method=="+"){
                noOfRating=role.noOfRating+n;
                newRating=(Number(role.rating*role.noOfRating)+Number(rating))/noOfRating;
            }
            else if(method=="-"){
                if(role.noOfRating-n<0){
                    throw new customError(400,"something went wrong while changing the rating1");
                }
                 noOfRating=role.noOfRating-n;
                 if(noOfRating==0){
                    newRating=0;
                 }else{
                    newRating=(Number(role.rating*role.noOfRating)-Number(rating))/noOfRating;
                 }
            }
            else if(method=="-+"){
                noOfRating=role.noOfRating;
                newRating=(Number(role.rating*role.noOfRating)+Number(rating)-Number(extra))/noOfRating;
            }
            await rolesModel.updateOne({_id:roleId},{$set:{rating:newRating,noOfRating}});
        }catch(err){
            throw new customError(400,"something went wrong while changing the rating");
        }
    }
    deleteRole=async (roleId,companyId)=>{
        try{
            const role=await rolesModel.findOneAndDelete({_id:roleId,companyId:companyId});
            await decreaseCount(companyId);
            return role;
        }catch(err){
            throw new customError(400,"something went wrong while deleting the role");
        }
    }
    DataOfEmployeeOfpermissionGivenOne=async (reqRoleId)=>{
        try{
            const data=await rolesModel.findById(reqRoleId,{"allowedtoComment":1,"_id":0});
            return data;
        }
        catch(err){
            throw new customError(400,"something went wrong while computing the roles")
        }
    }
    addEmployeeChangePermission=async (roleId,companyId,employeeId)=>{
        try{
            const role=await rolesModel.findOneAndUpdate({_id:roleId,companyId:companyId},{$addToSet:{allowedtoComment:employeeId}});
            return role;
        }
        catch(err){
            throw new customError(400,"something went wrong while computing the roles")
        }
    }
    removeEmployeeChangePermission=async (roleId,companyId,employeeId)=>{
        try{
            const role=await rolesModel.findOneAndUpdate({_id:roleId,companyId:companyId},{$pull:{allowedtoComment:employeeId}});
            return role;
        }
        catch(err){
            throw new customError(400,"something went wrong while computing the roles")
        }
    }
    noOfCommentsAllowedChangeByAdmin=async (roleId,companyId,noOfCommentsAllowed)=>{
        try{
            const role=await rolesModel.findOneAndUpdate({_id:roleId,companyId:companyId},{$set:{noOfCommentsAllowed}});
            return role;
        }
        catch(err){
            throw new customError(400,"something went wrong while computing the roles")
        }
    }
    deleteRoleByUserId=async (userId)=>{
        try{
            await rolesModel.deleteMany({userId});
        }
        catch(err){
            throw new customError(400,"something went wrong while deleting the role");
        }
    }
}

import {companyRepository} from "../company/company.repository.js"
const companyR=new companyRepository();
async function increaseCount(companyId){
    return await companyR.addOrRemoveEmployee(companyId,1,"+")
}
async function decreaseCount(companyId){
    return await companyR.addOrRemoveEmployee(companyId,1,"-")
}