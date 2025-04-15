import mongoose from "mongoose"
import { userSchema } from "./user.schema.js"
import { customError } from "../../middlewares/error.middleware.js";
import bcrupt from "bcrypt";

const userModel=mongoose.model("users",userSchema);

export class userRepository{
    addUser=async (email,password,name,about,photoPath,bannerPath,photoOriginalName,bannerOriginalName)=>{
        try{
            const newUser=await userModel.create({email,password,name,about,photoPath,bannerPath,photoOriginalName,bannerOriginalName});
            await newUser.save();
            return newUser;
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
            else if(err.code===11000){
                throw new customError(400,"the email is provied already exist,please choose another","email");
            }
            else{
                throw new customError(400,"something went wrong while creating the user");
            }
        }
    }
    findUserByEmail=async (email)=>{
        try{
            const user=await userModel.findOne({email});
            return user;
        }
        catch(err){
            throw new customError(400,"something went wrong while picking up the user");
        }
    }
    confirmUserIdUsingConnectinId=async (userId,connectionId)=>{
        try{
            const user=await userModel.findById(userId);
            if(!user){
                throw new customError(400,"given the wrong credentials");
            }
            if(user.connectionId==connectionId){
                return user;
            }
            else{
                return false;
            }
        }
        catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while picking up the user")
            }
        }
    }
    changeConnectionId=async (userId)=>{
        try{
            const user=await userModel.findById(userId);
            if(!user){
                throw new customError(400,"given the wrong credentials");
            }
            let generatedRandomNumber = Math.floor(Math.random() * 100000000);
            while(user.connectionId==generatedRandomNumber){
                generatedRandomNumber = Math.floor(Math.random() * 100000000);
            }
            user.connectionId=generatedRandomNumber;
            user.save();
        }catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while doing logout");
            }
        }
    }
    ToogleEmailVerify =async (email,emailVerified)=>{
        try{
            const user=await userModel.findOne({email:email});
            if(!user){
                throw new customError(400,"email is not found, please go for signin")
            }
            user.verified=emailVerified;
            user.save();
        }catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong with email");
            }
        }
    }
    resetPassword=async (email,password)=>{
        try{
            const user=await userModel.findOne({email:email});
            if(!user){
                throw new customError(400,{status:true,msg:"email is not found, please go for signin"})
            }
            user.verified=true;
            password=await bcrupt.hash(String(password),10);
            user.password=password;
            let generatedRandomNumber = Math.floor(Math.random() * 100000000);
            while(user.connectionId==generatedRandomNumber){
                generatedRandomNumber = Math.floor(Math.random() * 100000000);
            }
            user.connectionId=generatedRandomNumber;
            user.save();
        }catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while changing password");
            }
        }
    }
    getDataUsingId=async (userId)=>{
        try{
            const user=await userModel.findById(userId);
            if(!user){
                throw new customError(400,"given the wrong credentials");
            }
            return user;
        }
        catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while picking up the user");
            }
        }
    }
    updateUserDetails=async (userId,name,about)=>{
        try{
            const user=await userModel.findById(userId);
            if(!user){
                throw new customError(400,"given the wrong credentials");
            }
            if(name&&name!="")user.name=name;
            if(about&&about!="")user.about=about;
            user.save();
            return user;
        }
        catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while updating the user");
            }
        }
    }
    updateUserPhoto=async (userId,photoPath,photoOriginalName,type)=>{
        try{
            const user=await userModel.findById(userId);
            if(!user){
                throw new customError(400,"given the wrong credentials");
            }
            if(type=="photo"){
                user.photoPath=photoPath;
                user.photoOriginalName=photoOriginalName;
            }
            else if(type=="banner"){
                user.bannerPath=photoPath;
                user.bannerOriginalName=photoOriginalName;
            }
            user.save();
            return user;
        }
        catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while updating the user");
            }
        }
    }
    deleteUser= async (userId)=>{
        try{
            const user=await userModel.findByIdAndDelete(userId);
            return user;
        }catch(err){
            throw new customError(400,"something went wrong while deleting the user");
        }
    }
    updateTheNotificationCount=async (userId,notificationCount)=>{
        try{
            const user=await userModel.findById(userId);
            if(!user){
                throw new customError(400,"given the wrong credentials");
            }
            if(notificationCount>0)user.notificationCount+=notificationCount;
            else user.notificationCount=0;
            user.save();
        }
        catch(err){
            throw new customError(400,"something went wrong while updating the user");
        }
    }
}