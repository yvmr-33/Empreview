import {otpRepository} from "./otp.repository.js"
import {userRepository}from "../users/user.repository.js"
import { customError } from "../../middlewares/error.middleware.js";

const userRep=new userRepository();

export class otpController{
    constructor(){
        this.otpRepository=new otpRepository();
    }
    create=async (req,res,next)=>{
        try {
            const {email,otp}=req.body;
            if(!email||!otp){
                throw new customError(400,"please provide the basic details (eamil)");
            }
            const otpData=await this.otpRepository.create(otp,email);
            res.status(200).json({status:true,msg:"otp generated successfully, it will expire by 5 mintues"});
        } catch (error) {
            next(error);
        }
    }
    verify=async (req,res,next)=>{
        try {
            const {email,otp}=req.body;
            if(!email||!otp){
                throw new customError(400,"please provide the basic details (eamil && otp)");
            }
            const otpData=await this.otpRepository.verify(email,parseInt(otp));
            if(otpData){await userRep.ToogleEmailVerify(email,true);res.status(200).json({message:"otp verified successfully"});}
            else{
                throw new customError(400,"otp was wrong");
            }
        } catch (error) {
            next(error);
        }
    }
    resetpassword=async (req,res,next)=>{
        try {
            let {email,otp,password}=req.body;
            if(!email||!otp||!password){
                throw new customError(400,"please provide the basic details (eamil & otp & password)");
            }
            const otpData=await this.otpRepository.verify(email,parseInt(otp));
            if(otpData){
                await userRep.resetPassword(email,password);
                res.json({status:true,msg:"password reset successfully"});}
            else{
                throw new customError(400,"otp was wrong");
            }
        } catch (error) {
            next(error);
        }
    }
    checkEmail=async (req,res,next)=>{
        try{
            const {email}=req.body;
            if(!email){
                throw new customError(400,"please provide the basic information about eamil id");
            }
            const user=await userRep.findUserByEmail(email);
            if(!user){
                throw new customError(400,"please provide the email that you login email, please go for sigin");
            }
            next();
        }
        catch(err){
            next(err);
        }
    }
}