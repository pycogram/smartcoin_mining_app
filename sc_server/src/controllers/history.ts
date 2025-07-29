import { Request, Response} from "express"; 
import { errHandler } from "../utils/error-handler.js";
import historyModel from "../models/history.js";

const historySc = async(req: Request, res: Response):Promise<void> => {
    try{
        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        // const page = parseInt(req.query.page as string) || 1;
        // const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

        // get the history of the user
        const historyUser = await historyModel.find({user: userId})
                                              .sort({time: -1})
                                              .select('-__v -user')
                                            //   .skip((page - 1) * limit)  
                                            //   .limit(limit); 
        
        // check if the user has any history
        if(!historyUser || historyUser.length === 0) 
            return errHandler(res, "no history found for this user");

        // count histories
        const noOfHistory = historyUser.length;

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