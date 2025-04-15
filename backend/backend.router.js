import express from "express";
import user from "./src/feature/users/user.router.js";
import otp from "./src/feature/otp/otp.router.js";
import rolesAndRequest from "./src/feature/rolesAndRequest/rolesAndRequest.router.js";
import company from "./src/feature/company/company.router.js";
import requestTouser from "./src/feature/requestToUser/requestToUser.router.js";
import comment from "./src/feature/comment/comment.router.js";
import notification from "./src/feature/notifications/notifications.router.js";
import {mailer} from "./src/middlewares/emailsender.middleware.js";

const app=express.Router();

app.use("/user",user);
app.use("/otp",otp);
app.use("/rolesAndRequest",rolesAndRequest);
app.use("/company",company);
app.use("/requestTouser",requestTouser);
app.use("/comment",comment);
app.use("/notification",notification);


app.get("/contact",(req,res,next)=>{
    const {name,email,msg}=req.query;
    req.body={};
    req.body.html=`<h1>${name} want to contact  you</h1><br>
    <h2>Message:-</h2><br><p>${msg}</p><br><h2>their email:-   ${email}</h2>`;
    req.body.subject="Contact";
    req.body.email=process.env.email;
    next();
},mailer,(req,res)=>{res.send({status:true,msg:"done"})});

export default app;