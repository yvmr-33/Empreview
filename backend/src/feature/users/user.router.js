import express from "express"
import { userController } from "./user.controller.js";
import upload from "../../middlewares/fileupload.middleware.js";
import { authorization } from "../../middlewares/authorizer.middleware.js";



const app=express.Router();
const userC=new userController();

app.get("/authorization-check",authorization,(req,res,next)=>{res.json({status:true,msg:"authorized sucessfully"});});

app.post("/sigin",upload.fields([{name:"photo",maxCount:1},{name:"banner",maxCount:1}]),(req,res,next)=>{userC.addNewUser(req,res,next)});
app.post("/login",(req,res,next)=>{userC.login(req,res,next)});

app.post("/logout",(req,res,next)=>{userC.logout(req,res,next)});
app.post("/logout-from-all-device",authorization,(req,res,next)=>{userC.logoutFromAllDevices(req,res,next)});

app.put("/update-profile-details",authorization,(req,res,next)=>{userC.updateUserDetails(req,res,next)});
app.put("/update-profile-photo",upload.fields([{name:"photo",maxCount:1},{name:"banner",maxCount:1}]),authorization,(req,res,next)=>{userC.updatePhotoAndBanner(req,res,next)});

app.delete("/delete-account",authorization,(req,res,next)=>{userC.deleteUser(req,res,next)});
export default app;