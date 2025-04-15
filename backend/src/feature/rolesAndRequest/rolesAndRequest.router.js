import express from "express";
import {authorization} from "../../middlewares/authorizer.middleware.js";
import { rolesAndRequestController } from "./rolesAndRequest.controller.js";

const app=express.Router();
const rolesAndRequestC=new rolesAndRequestController();


app.get("/dataRoles",authorization,(req,res,next)=>{rolesAndRequestC.dataOfUserRoles(req,res,next)});
app.get("/dataRequests",authorization,(req,res,next)=>{rolesAndRequestC.dataOfUserRequests(req,res,next)});
app.post("/createRolesAndRequest",authorization,(req,res,next)=>{rolesAndRequestC.addNewRole(req,res,next)});
app.get("/requestsSent",authorization,(req,res,next)=>{rolesAndRequestC.dataOfRequestsToCompany(req,res,next)});
app.post("/requestToRole",authorization,(req,res,next)=>{rolesAndRequestC.changeRequestToRole(req,res,next);});
app.put("/changeRoleToAdmin",authorization,(req,res,next)=>{rolesAndRequestC.changeAdminToEmployee(req,res,next);});  
app.delete("/revertRequest",authorization,(req,res,next)=>{rolesAndRequestC.revertRequest(req,res,next);});
app.put("/changeRole",authorization,(req,res,next)=>{rolesAndRequestC.changeRole(req,res,next);});
app.delete("/deleteRole",authorization,(req,res,next)=>{rolesAndRequestC.deleteRole(req,res,next);});
app.get("/dataEmployeesAndPermissions",authorization,(req,res,next)=>{rolesAndRequestC.DataOfEmployeeUsingCompanyIdAndpermissionGivenOne(req,res,next)});
app.post("/changePermission",authorization,(req,res,next)=>{rolesAndRequestC.changePermissionOfEmployee(req,res,next)});
app.put("/changeNoOfComments",authorization,(req,res,next)=>{rolesAndRequestC.changenoOfCommentsAllowedbyAdmin(req,res,next)});

app.get("/dataEmployees",authorization,(req,res,next)=>{rolesAndRequestC.dataOfEmployees(req,res,next)});
app.get("/dataCommetsEmployee",authorization,(req,res,next)=>{rolesAndRequestC.getAllowedCommentUserDetails(req,res,next)});

export default app;