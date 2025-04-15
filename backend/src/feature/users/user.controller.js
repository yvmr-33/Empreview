import { customError } from "../../middlewares/error.middleware.js";
import { userRepository } from "./user.repository.js";
import {companyRepository} from  "../company/company.repository.js"
import {rolesRepository} from "../rolesAndRequest/roles.repository.js"
import {requestRepository} from "../rolesAndRequest/request.repository.js"
import bycrpt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();

export class userController {
    constructor(){
        this.userRepository=new userRepository();
        this.companyRepository=new companyRepository();
        this.rolesRepository=new rolesRepository();
        this.requestRepository=new requestRepository();
    }
    addNewUser=async (req,res,next)=>{
        try{
            //triming for the all elements for the req.body
            for(const key in req.body){
                if (typeof req.body[key] === 'string') {req.body[key]=req.body[key].trim();}
            }
            const {email,password,name,about}=req.body;
            let {photo,banner}=req.files;
            let photoPath,bannerpath,photoOriginalName,bannerOriginalName;
            if(photo){photoPath=photo[0].path.replace("public", '');;photoOriginalName=photo[0].originalname;}
            if(banner){bannerpath=banner[0].path.replace("public", '');;bannerOriginalName=banner[0].originalname;}
            await this.userRepository.addUser(email,password,name,about,photoPath,bannerpath,photoOriginalName,bannerOriginalName);
            res.status(201).send({status:true,msg:"user created sucessfully"});
        }catch(err){
            next(err);
        }

    }
    login=async (req,res,next)=>{
        try{
        let {email,password}=req.body;
        if(!email||!password){
            throw new customError(400,"please provide the information about email or password");
        }
        email=email.trim();
        password=String(password);
        password=password.trim();
        const user=await this.userRepository.findUserByEmail(email);
        if(!user){
            throw new customError(400,'user doesnot exist, check the email, please go for <a href="/signup">signup</a>');
        }
        if(!await bycrpt.compare(password,user.password)){
            throw new customError(400,"password was wrong");
        }
        //what ever you do login sucessfull;
        var token=jwt.sign({user:user._id,connectionId:user.connectionId}, process.env.jwt);
        res.cookie(process.env.cookieNameUserCredientails,token,{maxAge: parseInt(process.env.expoireOfCookieUserCredientails)});
        res.status(200).send({status:true,msg:"login sucessfull"});
        }
        catch(err){
            next(err);
        }
    }
    logoutFromAllDevices=async (req,res,next)=>{
        try{
            const {userId,connectionId}=req.userData;
            await this.userRepository.changeConnectionId(userId,connectionId);
            res.cookie(process.env.cookieNameUserCredientails,'',{expires:new Date(0)});
            res.json({status:true,msg:"logout from all device sucessfull"});
        }catch(err){
            next(err);
        }
    }
    logout=async (req,res,next)=>{
        try{
            res.cookie(process.env.cookieNameUserCredientails,'',{expires:new Date(0)});
            res.json({status:true,msg:"logout from this device sucessfull"});
        }catch(err){
            next(err);
        }
    }
    updateUserDetails=async (req,res,next)=>{
        try{
            const {userId}=req.userData;
            let {name,about}=req.body;
            name=name.trim();
            about=about.trim();
            if(await this.userRepository.updateUserDetails(userId,name,about)){
                res.json({status:true,msg:"user details updated sucessfully"});
            }
            else{
                throw new customError(400,"something went wrong while updating the user details");
            }
        }catch(err){
            next(err);
        }
    }
    updatePhotoAndBanner=async (req,res,next)=>{
        try{
            const {userId}=req.userData;
            let {photo,banner}=req.files;
            let photoPath,bannerpath,photoOriginalName,bannerOriginalName;
            if(photo){
                photoPath=photo[0].path.replace("public", '');
                photoOriginalName=photo[0].originalname;
                if(await this.userRepository.updateUserPhoto(userId,photoPath,photoOriginalName,"photo")){
                    res.json({status:true,msg:"user photo updated sucessfully"});
                    return;
                }
                else{
                    throw new customError(400,"something went wrong while updating the user photo");
                }
            }
            if(banner){
                bannerpath=banner[0].path.replace("public", '');
                bannerOriginalName=banner[0].originalname;
                if(await this.userRepository.updateUserPhoto(userId,bannerpath,bannerOriginalName,"banner")){
                    res.json({status:true,msg:"user banner updated sucessfully"});
                    return;
                }
                else{
                    throw new customError(400,"something went wrong while updating the user banner");
                }
            }
            else{
                throw new customError(400,"something went wrong while updating the user photo and banner");
            }
        }catch(err){
            next(err);
        }
    }
    deleteUser=async (req,res,next)=>{
        try{
            const {userId}=req.userData;
            if(await this.userRepository.deleteUser(userId)){
                await this.companyRepository.deleteUserFromAllCompany(userId);
                await this.rolesRepository.deleteRoleByUserId(userId);
                await this.requestRepository.deleteRequestByUserId(userId);
                res.cookie(process.env.cookieNameUserCredientails,'',{expires:new Date(0)});
                res.json({status:true,msg:"user deleted sucessfully"});
            }
            else{
                throw new customError(400,"something went wrong while deleting the user");
            }
        }catch(err){
            next(err);
        }
    }

}