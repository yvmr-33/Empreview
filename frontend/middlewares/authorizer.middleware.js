import jwt from "jsonwebtoken";
import { userRepository } from "../../backend/src/feature/users/user.repository.js";
import dotenv from "dotenv";

const userR=new userRepository();
dotenv.config();

export async function authorization(req,res,next){
    try{
        let token =req.cookies[process.env.cookieNameUserCredientails];
        if(token){
        let data=await jwt.verify(token,process.env.jwt);
        if(data.user&&data.connectionId){
            const user=await userR.confirmUserIdUsingConnectinId(data.user,data.connectionId);
            if(user){
                req.userData={};
                req.userData.userId=user._id;
                req.userData.name=user.name;
                if(req["StoreCokkieData"]){
                    req.userData.cookieData=data;
                }
                req.userData.companyId=data["companyId"];
                req.userData.role=data["role"];
                req.userData.companyName=data["companyName"];
                req.userData.roleId=data["roleId"];
                req.userData.notificationCount=user["notificationCount"];
                next();
            }
            else{
                res.cookie(process.env.cookieNameUserCredientails,'',{expires:new Date(0)});
                if(req["goNext"]){next();}
                else{
                    await res.render("access-denied",{title:"Acess denied",javascript:null,notifications:null})
                }
            }
        }else{
            res.cookie(process.env.cookieNameUserCredientails,'',{expires:new Date(0)});
            if(req["goNext"]){next();}
            else{
                await res.render("access-denied",{title:"Acess denied",javascript:null,notifications:null})
            }
        }
        }
        else{
            if(req["goNext"]){next();}
            else{
                await res.render("access-denied",{title:"Acess denied",javascript:null,notifications:null})
            }
        }
    }
    catch(err){
        res.cookie(process.env.cookieNameUserCredientails,'',{expires:new Date(0)});
        await res.render("access-denied",{title:"Acess denied",javascript:null,notifications:null})
    }
}