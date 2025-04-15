import express from 'express';
import { otpController } from './otp.controller.js';
import {mailer} from "../../middlewares/emailsender.middleware.js"
const app = express.Router();

const otpContr = new otpController();

app.post('/send',(req,res,next)=>{otpContr.checkEmail(req,res,next)},mailer, (req,res,next)=>{
    otpContr.create(req,res,next);
});

app.post('/verify', (req,res,next)=>{
    otpContr.verify(req,res,next);
});
app.put("/reset-password",(req,res,next)=>{
    otpContr.resetpassword(req,res,next);
})
export default app;