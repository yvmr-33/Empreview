import multer from "multer";
import path from "path";
import {customError} from"./error.middleware.js";

const storage=multer.diskStorage({
    destination:function (req,file,cb){
        //dynamic storage
        let ds='public'
        if(req.fileStorageCustom){
            ds=req.fileStorageCustom;
        }
        else if(file.fieldname==="photo"){
            ds=ds+"/images/photos"
        }
        else if(file.fieldname=="banner"){
            ds=ds+"/images/banners"
        }
        else{
            ds=ds+"/others"
        }
        cb(null,ds);
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"-"+Date.now()+"-"+path.extname(file.originalname));
    }
})

function fileFilter(req,file,cb){
    if(file.mimetype.startsWith('image/')||req.allowAllFiles){
        cb(null,true);
    }
    else{
        cb(new customError(400,"Images are only allowed"),false);
    }
};


const upload=multer({storage:storage,fileFilter: fileFilter,});

export default upload;