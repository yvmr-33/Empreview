import express from 'express';
import { notificationController} from './notifications.controller.js';
import {authorization} from "../../middlewares/authorizer.middleware.js";

const app = express.Router();

const notificationC = new notificationController();

app.get('/get', authorization,(req,res,next)=>{notificationC.get(req,res,next)});
app.delete('/remove/:id', authorization,(req,res,next)=>{notificationC.delete(req,res,next)});

export default app;