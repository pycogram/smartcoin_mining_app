import { Response } from 'express';

export const errHandler = (res:Response, message:string, statusCode:number = 400, status:string = "success") => { 
    res.status(statusCode).json({status, message });
}