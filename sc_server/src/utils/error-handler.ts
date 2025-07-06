import { Response } from 'express';

export const errHandler = (res:Response, message:string, _id: string = "", first_name: string = "",
    email: string = "",statusCode:number = 400, status:string = "failed") => {
    res.status(statusCode).json( ! first_name && ! email ? {status, message} : {status, id:_id, first_name, email, message});
}