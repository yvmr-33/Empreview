import mongoose from "mongoose"


const options=new mongoose.Schema({
    EachOtherComments:{type:"Boolean",require:true,default:false},
    privateComment:{type:"Boolean",require:true,default:false},
    userNoComments:{type:"Boolean",require:true,default:false},
    NoMoreComments:{type:"Boolean",require:true,default:false},
    showPrivateComment:{type:"Boolean",require:true,default:false},
    showNoComments:{type:"Boolean",require:true,default:false},
    defaultNoOfComments:{type:"Number",require:true,default:2},
})

export const companyschema=new mongoose.Schema({
    companyName:{type:"String",unique:true,required:true,},
    shortCompanyId:{type:"Number",required:true,unique:true,default:0},
    noOfEmployee:{type:"Number",required:true,default:0},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"users",require:true},
    adminId:{type:[mongoose.Schema.Types.ObjectId],ref:"roles",require:true,default:[]},
    about:{type:"String",require:true,default:""},
    photoName:{type:"String",require:true,default:"default-company.webp"},
    photoPath:{type:"String",require:true,default:"/website/default-company.webp"},
    options:{type:options,require:true,default:{}},
    time:{type:"Date",required:true,default:Date.now()},
});


companyschema.pre("save",async function(next){
    if(this.isNew){
        let generatedUniqueNumber = Math.floor(Math.random() * 100000000);
        let existingcheck=await this.constructor.findOne({shortCompanyId:generatedUniqueNumber});
        while(true){
            if(!existingcheck){break;}
            generatedUniqueNumber = Math.floor(Math.random() * 100000000);
            existingcheck=await this.constructor.findOne({shortCompanyId:generatedUniqueNumber});
        }
        this.shortCompanyId=generatedUniqueNumber;
    }
    next();
})
