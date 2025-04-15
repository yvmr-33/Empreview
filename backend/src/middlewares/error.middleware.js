import fs from 'fs';

export class customError extends Error{
    constructor(statuscode,message,key="msg"){
        if (typeof(message)=="object"){
            super("object");
            this.object=message;
        }else{
            super(message);
        }
        this.statuscode=statuscode;
        this.key=key;
    }
}

export function errorHandler(err, req, res, next) {
    let errorLog = '';

    if(err instanceof customError) {
        let send = {status: false}
        if(err.message == "object") {
            send[err.key] = err["object"];
        } else {
            send[err.key] = err.message;
        }
        res.status(err.statuscode).send(send);
        errorLog = `Time: ${new Date().toISOString()}, StatusCode: ${err.statuscode}, Error: ${JSON.stringify(send)}, IP: ${req.ip}, URL: ${req.originalUrl}\n`;
    } else {
        res.status(500).send({status: false, msg: "something wrong with the server"});
        errorLog = `Time: ${new Date().toISOString()}, StatusCode: 500, Error: something wrong with the server, IP: ${req.ip}, URL: ${req.originalUrl},msg:${err.message}\ns`;
    }

    fs.appendFile('errors.txt', errorLog, (err) => {
        if (err) console.log('Error writing to the errors.txt file', err);
    });
}