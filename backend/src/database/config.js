import mongoose  from "mongoose";



export const connect=()=>{
    try{
        mongoose.connect(process.env.mongoDbUrl);
        console.log("database is connected sucessfully");
    }catch(err){
        console.log("database is not connected");
    }
}