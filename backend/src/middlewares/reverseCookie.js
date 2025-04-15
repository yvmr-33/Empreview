import jwt from "jsonwebtoken";

export async function reverseCookie(req,res,next){
    try{
        let token =req.cookies[process.env.cookieNameUserCredientails];
        if(token){
        let data=await jwt.verify(token,process.env.jwt);
        if(data.user&&data.connectionId){
            req.userData={};
            req.userData.cookieData=data;
            next();
        }else{
            res.cookie("userCredientails",'',{expires:new Date(0)});
            next();
        }
        }
        else{
            next();
        }
    }
    catch(err){
        next();
    }
}