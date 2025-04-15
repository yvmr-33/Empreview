import jwt from "jsonwebtoken";
import { userRepository } from "../feature/users/user.repository.js";
import { customError } from "./error.middleware.js";
import dotenv from "dotenv";

const userR=new userRepository();
dotenv.config();

export async function authorization(req,res,next){
    try{
        let token =req.cookies[process.env.cookieNameUserCredientails];
        if(token){
        let data=await jwt.verify(token,process.env.jwt);
        if(data.user&&data.connectionId){
            if(await userR.confirmUserIdUsingConnectinId(data.user,data.connectionId)){
                req.userData={};
                req.userData.cookieData=data;
                req.userData.userId=data.user;
                req.userData.connectionId=data.connectionId,
                req.userData.companyName=data["companyName"];
                req.userData.companyId=data["companyId"];
                req.userData.role=data["role"];
                req.userData.roleId=data["roleId"];
                next();
            }
            else{
                res.cookie(process.env.cookieNameUserCredientails,'',{expires:new Date(0)});
                throw new customError(400,"login again");
            }
        }else{
            res.cookie(process.env.cookieNameUserCredientails,'',{expires:new Date(0)});
            throw new customError(400,"data is missing in cookie")
        }
        }
        else{
            throw new customError(400,"cookie is not there")
        }
    }
    catch(err){
        next(err);
    }
}