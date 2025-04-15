import {requestToUserRepository} from "./requestToUser.repository.js";
import {userRepository} from "../users/user.repository.js";
import { customError } from "../../middlewares/error.middleware.js";
import {rolesRepository} from "../rolesAndRequest/roles.repository.js";
import { requestRepository } from "../rolesAndRequest/request.repository.js";
import {mailer} from "../../middlewares/emailsender.middleware.js"
import {companyRepository} from "../company/company.repository.js";
import { notificationRepository } from "../notifications/notifications.repository.js";

export class  requestToUserController{
    constructor(){
        this.requestToUserRepository=new requestToUserRepository();
        this.userRepository=new userRepository();
        this.rolesRepository=new rolesRepository();
        this.requestRepository=new requestRepository();
        this.companyRepository=new companyRepository();
        this.notificationRepository=new notificationRepository();
    }
    addUser=async(req,res,next)=>{
        try{
            const {companyId,role,roleId,companyName}=req.userData;
            let {note,email}=req.body;
            //should handle when the admin is removed the another admin when he is logined
            if(!companyId&&!(role=="admin"||role=="both")){
                throw new customError(400,"please provide the companyId, or you are no the admin");
            }
            const user=await this.userRepository.findUserByEmail(email);
            if(!user){
                throw new customError(400,"Any user not exist with is email");
            }
            //should upgrade this process
            if(!await this.rolesRepository.findRoleUsingUserIdInCompany(user._id,companyId)&&user){
                const re=await this.requestRepository.findRequestUsingUserIdInCompanyReturnData(user._id,companyId);
                if(re){
                    await this.rolesRepository.changeRequestToRole(re);
                    await this.requestRepository.getElementByIdAndDelete(re._id);
                    res.send({status:true,msg:"the user is aldreay sent the requst to organisation. so, just accepted the request"});
                }
                else{
                    const a=await this.requestToUserRepository.addRequest(companyId,user._id,note,roleId);
                    if(a){
                        if(!note){note='';}
                        let html=`<!DOCTYPE html>
                        <html lang="en">
                        <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <title>Invitation to Join</title>
                        </head>
                        <body style="font-family: Arial, sans-serif;">
                        
                          <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 20px; text-align: center; background-color: #4CAF50; color: #fff;">
                                <h2>Invitation to Join</h2>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 20px;">
                                <p>
                                  A invitation to join the ${companyName} , 
                                </p>
                                <p>
                                  ${note}
                                  <br>
                                  this is the message requset to join the organisation, please find the buttom below to join
                                </p>
                                <p style="text-align: center;">
                                  <a href="${process.env.baseUrl}/v/r?c=${companyId}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">Join Now</a>
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 20px; text-align: center; background-color: #f0f0f0;">
                                <p style="font-size: 12px; color: #777;">
                                  This is an automated message. Please do not reply.
                                </p>
                              </td>
                            </tr>
                          </table>
                        
                        </body>
                        </html>
                        `;
                        let b={
                            body:{
                                email:email,
                                subject:`Invite to join the ${companyName} organisation`,
                                html:html
                            }
                        }
                        await mailer(b,null,null);
                        await res.json({status:true,msg:"sucessfully sent the request to email of the user"});
                    }
                }
            }
            else{
                throw new customError(400,"the user is aldready in organisation")
            }

        }
        catch(err){
            next(err);
        }
    }
    acceptTheRequest=async (req,res,next)=>{
      try{
        const {companyId}=req.body;
        const {userId}=req.userData;
        const re=await this.requestToUserRepository.acceptedOrrejectTheRequest(companyId,userId);
        if(re){
          const companyDetails=await this.companyRepository.getTheDataUsingCompanyId(companyId);
          await this.notificationRepository.add(userId,"You joined the company",companyDetails.companyName);
          const request={companyName:companyDetails.companyName,companyId:companyId,userId};
          await this.rolesRepository.changeRequestToRole(request);
          res.json({status:true,msg:"accepted the company sucessfully"});
        }else{
          throw new customError(400,"check teh details");
        }
      }catch(err){
        next(err);
      }
    }
    rejectTheRequest=async (req,res,next)=>{
      try{
        const {companyId}=req.body;
        const {userId}=req.userData;
        const re=await this.requestToUserRepository.acceptedOrrejectTheRequest(companyId,userId);
        if(re){
          res.json({status:true,msg:"rejected the company sucessfully"});
        }else{
          throw new customError(400,"check teh details");
        }
      }catch(err){
        next(err);
      }
    }
    addUser2=async(req,res,next)=>{
        try{
            const {userId,companyId}=req.body;
            res.json({result:await this.requestToUserRepository.addRequest2(companyId,userId)});
        }
        catch(err){
            next(err);
        }
    }
}