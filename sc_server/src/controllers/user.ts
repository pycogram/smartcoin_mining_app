import { Request, Response} from "express"; 
import { errHandler } from "../utils/error-handler";
import userModel from "../models/user";
import { registerUserSchema, verifyUserSchema } from "../utils/validator";
// import tokenizedUser from "../token/tokenized-user";
import HmacProcess from "../utils/hmac-process";
import { PasswordHash } from "../utils/password-handler";
import Transport from "../middlewares/send-mail";


// register user
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
    const hashedPassword = await PasswordHash(password);

    try {
        const userRegistered = await userModel.create({first_name, last_name, email, password: hashedPassword});
        // if(!userRegistered.email){
        //     throw new Error("email property not found");
        // }
        // const getUserToken  = tokenizedUser(userRegistered?._id, userRegistered?.email);
        res.status(200).json({
            status: `success`,
            message: `Account created successfully, To login, please request for email verification code.`,          
            first_name: userRegistered.first_name,
            email: userRegistered.email
        });
    } catch(err){
        res.status(500).json({
            status: `failed`,
            error: `Error occured: ${err as Error}`
        });
    }
}

// verify user
const verifyUser = async (req: Request, res: Response):Promise<void> => {
    const {email} = req.body;

    //check if email input is empty
    if(! email) return errHandler(res, "email field is required");

    // validate and sanitize email input
    const {error, value} = verifyUserSchema.validate({email});
    if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

    //check if user's email is reqistered before it receive verification code
    const existingUser = await userModel.findOne({email});
    if(!existingUser) return errHandler(res, "user does not exist. please register!");

    //check if user is verified
    if(existingUser.verified) return errHandler(res, "user already verified!");

    try {
        const generateCode = (length : number) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }    
        const codeValue = (generateCode(8)); 
        console.log(`codeValue: ${codeValue}`);
        
        const info = await Transport.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: existingUser.email!,
            subject: "Verification code",
            html: 
            `   <body style="font-family: Arial, position: relative; display: block; sans-serif style="background-color: #f4f4f4; padding: 10px;">
                    <h2 style="font-size: 22px; text-align: start; font-family: Arial, sans-serif;">
                        ~ Smartcoin, the mining app ~ 
                    </h2>

                    <div margin: 20px, 0; color: #333;">  
                        <p style="font-size: 16px; line-height: 1.5;">To verify your email address: <b style="color: #007BFF;">${existingUser.email}</b></p>
                        <p style="font-size: 16px; line-height: 1.5;">Please make use of the verification code below:</p>
                        <h2 style="font-size: 36px; color: #28a745; font-weight: bold;">${codeValue}</h2>
                    </div>

                    <p style="font-size: 14px; color: #555; font-style: italic; margin: 0;">
                        Note: verification code expires in <span style="color: #ff0000; font-weight: bold;">10 minutes</span>.
                    </p>
                </body>
            `            
        });

        if(info.accepted[0] === existingUser.email){
            if(! process.env.EMAIL_VERIFICATION_CODE_SECRET){
                throw new Error("process.env.EMAIL_VERIFICATION_CODE_SECRET is not defined");
            }
            const hashedCodeValue = HmacProcess(codeValue, process.env.EMAIL_VERIFICATION_CODE_SECRET);
            console.log(`hashedCodeValue: ${hashedCodeValue}`, typeof hashedCodeValue);

            existingUser.verified_code = hashedCodeValue.toString();

            existingUser.verified_time = Date.now();

            await existingUser.save();

            res.status(200).json({
                success: "success",
                email: existingUser.email,
                message: `A verification code has been sent to your email address. 
                          Please check either your email inbox or spam-box.`
            });
        }
    } catch(err){
        res.status(500).json({
            status: `failed`,
            error: `Error occured: ${err as Error}`
        });
    }
}

export {registerUser, verifyUser};