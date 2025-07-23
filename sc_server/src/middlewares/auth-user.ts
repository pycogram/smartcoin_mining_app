import { Request, Response, NextFunction} from "express"; 
import { errHandler } from "../utils/error-handler.js";
import { verifyUserToken } from "../token/tokenized-user.js";

export const authUser = async(req: Request, res:Response , next:NextFunction): Promise<void> => {
    // grab the token from either req header or cookie based on the environment
    let token = req.headers.client === 'not-browser' 
                ? req.headers.authorization 
                : req.cookies['Authorization'];

    if (!token) {
        return errHandler(res, "Unauthorized access, please login");
    }

    let originalToken =  token.split(" ")[1];

    const verifiedToken = verifyUserToken(originalToken);

    if (typeof verifiedToken === "string") {
        const errorMessage = verifiedToken.includes("expired")
            ? "Session expired, please log in again"
            : "Invalid token, please log in again";
        
        return errHandler(res, errorMessage);
    }
    
    // save the user in request
    let { user_id } = verifiedToken;

    (req as any).user_id = user_id;
    
    next();
}