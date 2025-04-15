import express from "express"
import {authorization} from "../../middlewares/authorizer.middleware.js";
import {reverseCookie}from "../../middlewares/reverseCookie.js";
import { companyController } from "./company.controller.js";
import fileupload from "../../middlewares/fileupload.middleware.js";
const companyC=new companyController();

const app=express.Router();

app.get("/about",(req,res,next)=>{companyC.getCompanyDetails(req,res,next);})
app.put("/companyDetails",authorization,(req,res,next)=>{companyC.UpdateCompanyDetails(req,res,next)});
app.put("/companyPhoto",authorization,(req,res,next)=>{
    req.fileStorageCustom="public/images/company"
    next();
},fileupload.single("company-photo"),(req,res,next)=>{companyC.updateThePhotoOfCompany(req,res,next)});
app.put("/resetCompanyId",authorization,(req,res,next)=>{companyC.resetTheShortCompanyId(req,res,next)});

app.get("/getOptions",reverseCookie,(req,res,next)=>{companyC.getOptionsOfTheCompany(req,res,next)});
app.put("/updateOptions",authorization,(req,res,next)=>{companyC.upateOptionsOfTheCompany(req,res,next)});
app.delete("/deleteCompany",authorization,(req,res,next)=>{companyC.deleteTheCompany(req,res,next)});


export default app;