import Jwt from "jsonwebtoken"; 
import { Types } from "mongoose";

// generate user token for identification
const signUserToken = (_id: Types.ObjectId) => { 
    const secret_token = process.env.SECRET_TOKEN;
    if(!secret_token) {
        throw new Error("SECRET_TOKEN is not defined in environment variables");
    }
    const user_id = _id.toHexString();
    return Jwt.sign({user_id}, secret_token, {expiresIn: "10d"}); // token expires in 10 days
}
const verifyUserToken = (token: string) => {
    const secret_token = process.env.SECRET_TOKEN;
    if(!secret_token) {
        throw new Error("SECRET_TOKEN is not defined in environment variables");
    }
    try {
        return Jwt.verify(token, secret_token);
    } catch (err) {
        return err instanceof Error ? err.message : "Invalid token";
    }
}

export { signUserToken, verifyUserToken};