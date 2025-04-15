import { customError } from "../../middlewares/error.middleware.js";
import { companyRepository } from "./company.repository.js";
import {rolesRepository} from "../rolesAndRequest/roles.repository.js";
import { requestRepository } from "../rolesAndRequest/request.repository.js";
import {requestToUserRepository} from "../requestToUser/requestToUser.repository.js";
import { notificationRepository } from "../notifications/notifications.repository.js";

const isValidObjectId = (id) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;  
    return objectIdPattern.test(id);
};


export class companyController{
    constructor(){
        this.companyRepository=new companyRepository();
        this.rolesRepository=new rolesRepository();
        this.requestRepository=new requestRepository();
        this.requestToUserRepository=new requestToUserRepository();
        this.notificationRepository=new notificationRepository();
    }
    getCompanyDetails=async (req,res,next)=>{
        try{
            const companyId=req.body["companyId"];
            if(!companyId){throw new customError(400,"Must provide the companyId");}
            //check whether the userid macthes with the cpompany id
            const company=await this.companyRepository.getTheDataUsingCompanyId(companyId);
            res.json(company);
        }
        catch(err){
            next(err);
        }
    }
    UpdateCompanyDetails=async (req,res,next)=>{
        try{
            //triming for the all elements for the req.body
            for(const key in req.body){
                if (typeof req.body[key] === 'string') {req.body[key]=req.body[key].trim();}
            }
            let {companyName,about}=req.body;
            let {userId,companyId,role,roleId}=req.userData;

            if(!isValidObjectId(roleId)){
                throw new customError(400,"give the correct roleid");
            }
            if(!companyName&&!about&&companyName==''&&about==''){
                throw new customError(400,"give some proper details company name or about");
            }
            //check the userId macthes with rolesId
            if(!(companyId&&role&&(role=="admin"||role=="both"))){
                const roleG=await this.rolesRepository.checkUserIdToAdminId(userId,roleId);
                if(!roleG){
                    throw new customError(400,"check the roleid or you are not the admin");
                }
                companyId=roleG.companyId;
                role=roleG.role;
            }

            //check the name exists are not
            
            let nameChange=await this.companyRepository.updateTheDetailsOfTheCompany(companyId,roleId,companyName,about);
            
            res.json({status:true,msg:"successfully changed the details"});

            if(nameChange){
                //change the company name in roles also
                await this.requestRepository.changeCompanyNameToCompanyId(companyName,companyId);
                await this.rolesRepository.changeCompanyNameToCompanyId(companyName,companyId);
            }
        }
        catch(err){
            next(err);
        }
    }
    updateThePhotoOfCompany=async (req,res,next)=>{
        try{
            let photo=req.file;
            let {companyId,role,roleId}=req.userData;
            if(!photo){
                throw new customError(400,"please upload the image");
            }
            if(!(companyId&&roleId&&role&&(role=="admin"||role=="both"))){
                throw new customError(400,"check the roleid or you are not the admin");                
            }
            let photoPath=photo.path.replace("public", '');
            let photoName=photo.originalname;
            await this.companyRepository.updateTheCompanyPhoto(companyId,roleId,photoPath,photoName);
            res.json({status:true,msg:"successfully changed the photo"});
        }catch(err){
            next(err);
        }
    }
    resetTheShortCompanyId=async(req,res,next)=>{
        try{
            let {companyId,roleId}=req.userData;
            const shortCompanyId= await this.companyRepository.resetTheShortCompanyId(companyId,roleId);
            res.json({status:true,msg:"successfully reset the company id",companyId:shortCompanyId});
        }catch(err){
            next(err);
        }
    }
    deleteTheCompany=async(req,res,next)=>{
        try{
            let {companyId,role,roleId,userId,companyName}=req.userData;
            if(!(companyId&&roleId&&role&&userId&&(role=="admin"||role=="both"))){
                throw new customError(400,"check the roleid or you are not the admin");                
            }
            if(await this.companyRepository.deleteTheCompany(companyId,roleId,userId)){
                await this.rolesRepository.deleteRoleByCompanyId(companyId);
                await this.requestRepository.deleteRequestByCompanyId(companyId);
                await this.requestToUserRepository.deleteAllRequestRelatedToCompany(companyId);
                await this.notificationRepository.add(userId,"company deleted successfully",companyName)
                res.json({status:true,msg:"successfully deleted the company"});
            }else{
                throw new customError(400,"something went wrong while deleting the company");
            }
        }catch(err){
            next(err);
        }
    }
    upateOptionsOfTheCompany=async(req,res,next)=>{
        try{
            let {companyId,role,roleId}=req.userData;
            if(!(companyId&&roleId&&role&&(role=="admin"||role=="both"))){
                throw new customError(400,"check the roleid or you are not the admin");                
            }
            let {privateComment,userNoComments,NoMoreComments,EachOtherComments,showPrivateComment,showNoComments,defaultNoOfComments}=req.body;
            if(privateComment==undefined||userNoComments==undefined||NoMoreComments==undefined||EachOtherComments==undefined
                ||showPrivateComment==undefined||showNoComments==undefined||defaultNoOfComments==undefined||defaultNoOfComments<0){
                throw new customError(400,"please give the all options");
            }
            await this.companyRepository.upateOptionsOfTheCompany(companyId,roleId,{privateComment,userNoComments,NoMoreComments,EachOtherComments
                ,showPrivateComment,showNoComments,defaultNoOfComments});
            res.json({status:true,msg:"successfully updated the options"});
        }catch(err){
            next(err);
        }
    }
    getOptionsOfTheCompany=async(req,res,next)=>{
        try{
            let companyId=req.body["companyId"];
            if(!companyId&&req["userData"]&&req.userData["cookieData"]){companyId=req.userData.cookieData["companyId"];}
            if(!companyId){throw new customError(400,"please give the companyId");}
            const options=await this.companyRepository.getCompanyOptions(companyId);
            res.json({status:true,data:options});
        }catch(err){
            next(err);
        }
    }
}