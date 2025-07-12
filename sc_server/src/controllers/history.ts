import e, { Request, Response} from "express"; 
import { errHandler } from "../utils/error-handler";
import historyModel from "../models/history";

const historySc = async(req: Request, res: Response):Promise<void> => {
    try{
        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        // get the history of the user
        const historyUser = await historyModel.find({user: userId}).sort({time: -1}).select('-__v -user');
        
        // check if the user has any history
        if(!historyUser || historyUser.length === 0) 
            return errHandler(res, "no history found for this user");

        res.status(200).json({
            status: "success",
            message: "history fetched successfully",
            data: historyUser
        });

    } catch(err){
        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        });
    }
}

export {
    historySc       
};