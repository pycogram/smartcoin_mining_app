import { Response } from 'express';

export const errHandler = (res:Response, message:string, statusCode:number = 400, status:string = "failed") => { 
    res.status(statusCode).json({status, message });
}