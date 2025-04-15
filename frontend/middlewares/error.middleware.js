export class customError extends Error{
    constructor(statuscode,message,key="msg"){
        super(message);
        this.statuscode=statuscode;
        this.key=key;
    }
}
