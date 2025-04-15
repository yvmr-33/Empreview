import { customError } from "../../middlewares/error.middleware.js";
import {notificationRepository} from "./notifications.repository.js"

export class notificationController {
    constructor() {
        this.notificationRepository = new notificationRepository();
    }
    get=async(req,res,next)=>{
        try{
            const result = await this.notificationRepository.get(req.userData.userId);
            res.status(200).json({status:true,data:result});
        }catch(err){
            next(err);
        }
    }
    delete=async(req,res,next)=>{
        try{
            if(!req.params.id){
                throw new customError("id is required");
            }
            const result = await this.notificationRepository.delete(req.userData.userId,req.params.id);
            res.status(200).json({status:true,data:result});
        }catch(err){
            next(err);
        }
    }
}