import { Request, Response} from "express"; 
import { errHandler } from "../utils/error-handler";
import userModel from "../models/user";
import { registerUserSchema } from "../utils/validator";
import bcrypt from "bcrypt";

const registerUser = async (req: Request, res: Response):Promise<void> => {
    const {first_name, last_name, email, password, confirmed_password} = req.body;

    //check if all input are empty
    if(! first_name || ! last_name || ! email || ! password || ! confirmed_password) return errHandler(res, "all fields are required")

    // validate and sanitize user inputs
    const {error, value} = registerUserSchema.validate({first_name, last_name, email, password});
    if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

    // check if password and confirm password are the same
    if(password !== confirmed_password) return errHandler(res, "confirm password does not match");

    //check if email exists
    const emailExist = await userModel.findOne({email});
    if(emailExist) return errHandler(res, "email registered already, please login!");

    // hash password
    const saltNum = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("" + password, saltNum);

    try {
        const userRegistered = await userModel.create({first_name, last_name, email, password: hashedPassword});

        res.status(200).json({
            status: `success`,
            message: `Account created successfully, To login, please request for email verification code.`,          
            first_name: userRegistered.first_name,
            email: userRegistered.email,
        });
    } catch(err){
        //console.log("Handled error:", (err as Error).message);
        res.status(500).json({
            status: `failed`,
            error: `Error occured: ${err as Error}`
        });
    }
}

export {registerUser};