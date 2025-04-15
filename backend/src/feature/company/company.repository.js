import mongoose from "mongoose";
import { companyschema } from "./company.schema.js";
import { customError } from "../../middlewares/error.middleware.js";

const companyModel=mongoose.model("company",companyschema);


export class companyRepository{
    add=async (companyName,userId,about)=>{
        try{
            const newCompany=companyModel.create({companyName,userId,about});
            return await newCompany;
        }
        catch(err){
            throw new customError(400,"organisation name is is aldready exist , choose another");
        }
    }
    getCompanyByShortComapyId=async (shortCompanyId)=>{
        try{
            const company=await companyModel.findOne({shortCompanyId},{noOfEmployee:0,admin:0});
            return company;
        }
        catch(err){
            throw new customError(400,"something went wrong will creating the account, please tryagain");
        }
    }
    addOrRemoveEmployee=async(companyId,employeeNumber,method)=>{
        try{
            let company=await companyModel.findById(companyId);
            if(!company){throw new customError(400,"company is not found");}
            if(method=="+"){
                company.noOfEmployee+=employeeNumber;
            }
            else if(method=="-"){
                if(company.noOfEmployee<employeeNumber){throw new customError(400,"data is mismathed while changing the employee");}
                company.noOfEmployee-=employeeNumber;
            }
            await company.save();
            return company;
        }
        catch(err){
            throw new customError(400,"something went wrong while changing the emplyoees");
        }
    }
    getTheDataUsingCompanyId=async (companyId)=>{
        try{
            let company=await companyModel.findById(companyId,"shortCompanyId companyName noOfEmployee time photoName photoPath about");
            if(!company){throw new customError(400,"Company not found with the company id");}
            return company;
        }catch(err){
            throw new customError(400,"something went wrong while computing the company about");
        }
    }
    checkTheAdminUseCompanyIdAndGetData=async (companyId,roleId)=>{
        try{
            let company=await companyModel.findById(companyId);
            if(!company){throw new customError(400,"Company not found with the company id");}
            let CheckAdmin=false;
            for(let i of company.adminId){
                if(i==roleId){CheckAdmin=true;break;}
            }
            if(!CheckAdmin){
                throw new customError(400,"you are not admin,to change");
            }
            return company;
        }catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while computing the company about");
            }
        }
    }
    checkTheCompanyName=async(companyName)=>{
        try{
            let count =await companyModel.countDocuments({companyName});
            return count;
        }
        catch(err){
            throw new customError(400,"something went wrong while checking");
        }
    }
    updateTheDetailsOfTheCompany=async (companyId,roleId,companyName,about )=>{
        try{
            let company=await companyModel.findById(companyId);
            if(!company){throw new customError(400,"Company not found with the company id");}
            let CheckAdmin=false;
            for(let i of company.adminId){
                if(i==roleId){CheckAdmin=true;break;}
            }
            if(!CheckAdmin){
                throw new customError(400,"you are not admin,to change");
            }
            if(company.companyName==companyName){
                if(company.about!=about){company.about=about;company.save();}
                return false;
            }else{
                //check the name
                if(await this.checkTheCompanyName(companyName)){
                    throw new customError(400,"Name aldready taken ,choose another");
                }
                company.companyName=companyName;
                company.about=about;
                company.save();
                return true;
            }
        }
        catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while updating the company details");
            }
        }
    }
    updateTheCompanyPhoto=async (companyId,roleId,photoPath,photoName)=>{
        try{
            let company=await companyModel.findById(companyId);
            if(!company){throw new customError(400,"Company not found with the company id");}
            let CheckAdmin=false;
            for(let i of company.adminId){
                if(i==roleId){CheckAdmin=true;break;}
            }
            if(!CheckAdmin){
                throw new customError(400,"you are not admin,to change");
            }
            company.photoName=photoName;
            company.photoPath=photoPath;
            await company.save();
        }catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong with the server while changing the company photo");
            }
        }
    }
    resetTheShortCompanyId=async(companyId,roleId)=>{
        try{
            let company=await this.checkTheAdminUseCompanyIdAndGetData(companyId,roleId);
            const generatedUniqueNumber = Math.floor(Math.random() * 100000000);
            let existingcheck=await companyModel.findOne({shortCompanyId:generatedUniqueNumber});
            while(true){
                if(!existingcheck){break;}
                generatedUniqueNumber = Math.floor(Math.random() * 100000000);
                existingcheck=await companyModel.findOne({shortCompanyId:generatedUniqueNumber});
            }
            company.shortCompanyId=generatedUniqueNumber;
            await company.save();
            return company.shortCompanyId;

        }catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while updating the company details");
            }
        }
    }
    deleteTheCompany=async (companyId,roleId,userId)=>{
        try{
            let company=await this.checkTheAdminUseCompanyIdAndGetData(companyId,roleId);
            
            if(company.userId!=userId){
                throw new customError(400,"you are not supreme admin,to delete");
            }
            
            await companyModel.deleteOne({_id:companyId});
            
            return true;
        }
        catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while deleting the company");
            }
        }
    }
    upateOptionsOfTheCompany=async (companyId,roleId,options)=>{
        try{
            let company=await this.checkTheAdminUseCompanyIdAndGetData(companyId,roleId);
            company.options.EachOtherComments=options.EachOtherComments;
            company.options.privateComment=options.privateComment;
            company.options.userNoComments=options.userNoComments;
            company.options.NoMoreComments=options.NoMoreComments;
            company.options.showPrivateComment=options.showPrivateComment;
            company.options.showNoComments=options.showNoComments;
            company.options.defaultNoOfComments=options.defaultNoOfComments;
            await company.save();
            return true;
        }
        catch(err){
            if (err instanceof customError){
                throw new customError(400,err.message);
            }else{
                throw new customError(400,"something went wrong while updating the company options");
            }
        }
    }
    getCompanyOptions=async (companyId)=>{
        try{
            let company=await companyModel.findById(companyId,"options -_id");
            if(!company){throw new customError(400,"Company not found with the company id");}
            return company.options;
        }catch(err){
            throw new customError(400,"something went wrong while getting the company options");
        }
    }
    changeAdminRole=async(roleId,companyId,method)=>{
        try{
            let company=await companyModel.findById(companyId);
            if(!company){throw new customError(400,"Company not found with the company id");}
            if(method=="+"){
                let index=company.adminId.indexOf(roleId);
                if(index==-1){company.adminId.push(roleId);}
            }
            else if(method=="-"){
                let index=company.adminId.indexOf(roleId);
                if(index==-1){return;}
                company.adminId.splice(index,1);
            }
            await company.save();
            return company;
        }catch(err){
            throw new customError(400,"something went wrong while changing the admin role");
        }
    }
    deleteUserFromAllCompany=async (userId)=>{
        try{
            await companyModel.deleteMany({userId});
        }catch(err){
            throw new customError(400,"something went wrong while deleting the user from all company");
        }
    }
}


