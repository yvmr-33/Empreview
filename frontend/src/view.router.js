import express from "express"
import { viewController } from "./view.controller.js";
import {authorization} from "../middlewares/authorizer.middleware.js"

const app=express.Router();

const  viewC=new viewController();


app.get("/",(req,res,next)=>{
    req["goNext"]="goNext";
    authorization(req,res,next);
}
,(req,res,next)=>{
    if(req.userData){
        res.redirect("/v");
    }else{
        viewC.home(req,res,next)
    }
});


app.get("/login",(req,res,next)=>{viewC.login(req,res,next)});
app.get("/signup",(req,res,next)=>{viewC.signup(req,res,next)});
app.get("/forgot-password",(req,res,next)=>{viewC.forgotPassword(req,res,next)});
app.get("/terms-and-conditions",(req,res,next)=>{viewC.termsAndCondition(req,res,next)});
app.get("/my-profile",authorization,(req,res,next)=>{viewC.myAccountProfile(req,res,next)});

app.get("/v",authorization,(req,res,next)=>{viewC.MyaccountView(req,res,next)});

app.get("/v/a",(req,res,next)=>{
    req["StoreCokkieData"]=true;
    authorization(req,res,next);
},(req,res,next)=>{viewC.adminViewHome(req,res,next)});

app.get("/v/a/about",authorization,(req,res,next)=>{viewC.adminViewAbout(req,res,next);});

app.get("/v/a/add",authorization,(req,res,next)=>{viewC.addEmployee(req,res,next)});
app.get("/v/a/employee",authorization,(req,res,next)=>{viewC.organisationEmployeePage(req,res,next)});
app.get("/v/a/employee/:roleId",authorization,(req,res,next)=>{viewC.adminEmployeeEditHome(req,res,next)});
app.get("/v/a/employee/:roleId/addPermission",authorization,(req,res,next)=>{viewC.addEmployeeToCommet(req,res,next)});
app.get("/v/a/settings",authorization,(req,res,next)=>{viewC.adminViewSettings(req,res,next);});

app.get("/v/r",authorization,(req,res,next)=>{viewC.requestToUserPage(req,res,next);})

app.get("/v/e",(req,res,next)=>{
    req["StoreCokkieData"]=true;
    authorization(req,res,next);
},(req,res,next)=>{viewC.employeeViewHome(req,res,next);});

app.get("/v/e/comment",authorization,(req,res,next)=>{viewC.employeeCommentPage(req,res,next);});

app.use((req,res,next)=>{res.status(404).render("404",{javascript:null,title:"Page not found",notifications:null})});

export default app;