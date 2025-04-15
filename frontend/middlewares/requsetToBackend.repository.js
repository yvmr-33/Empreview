import {companyRepository} from "../../backend/src/feature/company/company.repository.js"
import {rolesRepository} from "../../backend/src/feature/rolesAndRequest/roles.repository.js";
import {requestToUserRepository} from "../../backend/src/feature/requestToUser/requestToUser.repository.js"
import {userRepository} from "../../backend/src/feature/users/user.repository.js";
export class requestToBackend{
    constructor(){
        this.companyRepository=new companyRepository();
        this.rolesRepository=new rolesRepository();
        this.requestToUserRepository=new requestToUserRepository();
        this.userRepository=new userRepository();
    }
    checkTheCompanyToUserIdToAdmin=async (userId,rolesId)=>{
        const role=await this.rolesRepository.checkUserIdToAdminId(userId,rolesId);
        return role;
    }
    getCompanyDetails=async (companyId,roleId)=>{
        const company=await this.companyRepository.checkTheAdminUseCompanyIdAndGetData(companyId,roleId);
        return company;
    }
    findTheRequest=async (companyId,userId)=>{
        let a=await this.requestToUserRepository.companyDetailsToUser(companyId,userId);
        return a;
    }
    getTheDataOfEmployee=async (roleId)=>{
        const employee=await this.rolesRepository.getTheDataOfEmployee(roleId);
        return employee;
    }
    getTheDataOfUser=async (userId)=>{
        const user=await this.userRepository.getDataUsingId(userId);
        return user;
    }
}