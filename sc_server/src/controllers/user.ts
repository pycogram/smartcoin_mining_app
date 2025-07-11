import { Request, Response} from "express"; 
import { errHandler } from "../utils/error-handler";
import userModel from "../models/user";
import { confirmUserSchema, loginUserSchema, registerUserSchema, verifyUserSchema } from "../utils/validator";
import HmacProcess from "../utils/hmac-process";
import { PasswordHash, PasswordVerify } from "../utils/password-handler";
import Transport from "../utils/send-mail";
import mongoose from "mongoose";
import { signUserToken, verifyUserToken } from "../token/tokenized-user";
import minerModel from "../models/miner";
import referralModel from "../models/referral";
import { generateCode } from "../token/generate-code";

// register user
const registerUser = async (req: Request, res: Response):Promise<void> => {

    //destructure user inputs
    const {first_name, last_name, email, password, confirmed_password} = req.body;

    //check if all input are empty
    if(! first_name || ! last_name || ! email || ! password || ! confirmed_password) return errHandler(res, "all fields are required");

    // validate and sanitize user inputs
    const {error, value} = registerUserSchema.validate({first_name, last_name, email, password});
    if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

    // check if password and confirm password are the same
    if(password !== confirmed_password) return errHandler(res, "confirm password does not match");

    //check if email exists
    const emailExist = await userModel.findOne({email});
    if(emailExist) return errHandler(res, "email registered already, please login!");

    // get query string from the reg link and check if it exist in the db
    const uplineLink = req.query.ref as string;

    if(uplineLink){
        const defaultRegLink  = `${req.protocol}://${req.get('host')}${req.originalUrl.slice(0, req.originalUrl.indexOf("?"))}`;
        if(uplineLink && uplineLink.length != 12) return errHandler(res, `referral link is invalid. Try ${defaultRegLink}`);
        
        const uplineExist = await referralModel.findOne({ref_link: uplineLink});
        if(! uplineExist) return errHandler(res, `referral link is not registered. Try ${defaultRegLink}`);
        
        res.cookie('upline_link', uplineLink, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false
        })
    }

    // hash password
    const hashedPassword = await PasswordHash(password);

    try {
        const userRegistered = await userModel.create({first_name, last_name, email, password: hashedPassword});
        res.status(200).json({
            status: `success`,
            message: `Your account has been registered succesfully.`,          
            first_name: userRegistered.first_name,
            email: userRegistered.email,
            id: userRegistered._id
        });
    } catch(err){
        res.status(500).json({
            status: `failed`,
            error: `Error occured: ${err as Error}`
        });
    }
}
// verify user email by sensding verification code
const verifyUser = async (req: Request, res: Response):Promise<void> => {

    const {email} = req.body;

    //check if email input is empty
    if(! email) return errHandler(res, "email field is required");

    // validate and sanitize email input
    const {error, value} = verifyUserSchema.validate({email});
    if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

    //check if user's email is reqistered before it receive verification code
    const existingUser = await userModel.findOne({email}).select('+verified_time');
    if(!existingUser) return errHandler(res, "user does not exist. please register!");

    //check if user is verified
    if(existingUser.verified) return errHandler(res, "user already verified!");

    //user can only request a code after after 5mins
    if(existingUser?.verified_time){
        const timePassed = Date.now() - existingUser.verified_time;
        const waitTime = 5 * 60 * 1000;
        
        if(timePassed < waitTime){

            const timeLeft = waitTime - timePassed;
            const min = Math.floor(timeLeft / 60000);
            const sec = Math.floor((timeLeft % 60000) / 1000);

            return errHandler(res, `Please wait for ${min} minute(s) and ${sec} seconds before requesting for another code`);
        }
    }    

    try {

        const codeValue = generateCode(6); 
        
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

            existingUser.verified_code = hashedCodeValue.toString();

            existingUser.verified_time = Date.now();

            await existingUser.save();

            res.status(200).json({
                status: "success",
                email: existingUser.email,
                message: "A verification code has been sent to your email address. Please check either your email inbox or spam-box."
            });
        } else {
            res.status(500).json({
                status: "failed",
                message: 'Code failed to send!'
            });
        }

    } catch(err){
        res.status(500).json({
            status: `failed`,
            error: `Error occured: ${err as Error}`
        });
    }
}
// confirm user provided code then verify user
const confirmUser = async (req: Request, res: Response):Promise<void> => {

    const {code, id} = req.body;

    //check if code input is empty
    if(! code ) return errHandler(res, "all values are required");

    // validate and sanitize user inputs
    const {error, value} = confirmUserSchema.validate({code});
    if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

    //check if the id is a valid ObjectId
    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) 
        return errHandler(res, "Invalid user ID provided");
     
    // check if user exist
    const existingUser = await userModel.findOne({_id: id}).select('+verified_code +verified_time');
    if(! existingUser) return errHandler(res, "user is not registered yet");

    // check if user is verified already
    if(existingUser.verified) return errHandler(res, "user already verified!");

    // check if verified code and verified time have values
    if(! existingUser.verified_code || ! existingUser.verified_time) 
        return errHandler(res, "verify your account first");

    // check if code provided by the user is correct
    const codeValue = code.toString();
    const hashedCodeValue = HmacProcess(codeValue, process.env.EMAIL_VERIFICATION_CODE_SECRET!);
    if(hashedCodeValue !== existingUser.verified_code) 
        return errHandler(res, "invalid verification code: The code provided does not match the code sent to your email");

    // check if code has expired
    if(Date.now() - existingUser.verified_time > 10 * 60 * 1000) 
        return errHandler(res, "Code already expired. Please request for new code!");

    try{
        if(hashedCodeValue === existingUser.verified_code){
            existingUser.verified = true;
            existingUser.verified_code = undefined;
            existingUser.verified_time = undefined;
            
            await existingUser.save();

            // create user's mining db
            await minerModel.create({user: existingUser._id});

            // create user's ref db
            const refLink = generateCode(12).toString();
            const referredUser = await referralModel.create({user: existingUser._id, ref_link: refLink});
    
            const uplineExist = await referralModel.findOne({ref_link: req.cookies.upline_link});

            if(uplineExist){
                uplineExist.ref_no += 1;
                uplineExist.claim_bonus += 30
                uplineExist.total_bonus += 30 
                
                await uplineExist.save();
            }

            if(referredUser){
                referredUser.upline_link = req.cookies.upline_link;
                referredUser.upline_gain = 30
                
                await referredUser.save();
                res.clearCookie('upline_link');
            }

            res.status(200).json({                                                                                                                                                                                                                                                  
                status: "success",
                message: ! uplineExist ? 'Your account has been verified successfully. Please login!'
                                       : 'Your account has been verified successfully and your upline has been rewarded for inviting you. . Please login!'
            })            
        } else {
            res.status(400).json({                                                                                                                                                                                                                                                  
                status: "failed",
                message: 'The unexpected occured!'
            });
        }
    }catch(err){
        res.status(500).json({
            status: `failed`,
            error: `Error occured: ${err as Error}`
        });
    }


}
//login user
const loginUser = async (req: Request, res: Response):Promise<void> => {

    //destructure user inputs
    const {email, password} = req.body;

    //check if all input are empty
    if(! email || ! password) return errHandler(res, "all fields are required");        

    // validate and sanitize user inputs
    const {error, value} = loginUserSchema.validate({email, password});
    if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

    //check if user exist
    const userExist = await userModel.findOne({email}).select('+password');
    if(! userExist) return errHandler(res, "user does not exist!");

    //chech if password provided is correct
    const matchedPassword = await PasswordVerify(password, userExist?.password!);
    if(! matchedPassword) return errHandler(res, "email or password incorrect!");

    //check if user is verified
    if(! userExist.verified) 
        return errHandler(res, "user not verified, please verify your account first!", 
        userExist?._id.toString(), userExist?.first_name, userExist?.email);

    try{
        
        // generate user token
        const signedToken  = signUserToken(userExist._id!);

        res.cookie('Authorization', 'Bearer ' + signedToken, {
            expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // stores token in the browser for 10days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'

        }).status(200).json({
            status: `success`,
            message: `Logged in successfully`,
            id: userExist?._id,         
            email: userExist.email,
            token: signedToken,
        });

    }catch(err){
        res.status(500).json({
            status: `failed`,
            error: `Error occured: ${err as Error}`
        });
    }
}

export {
    registerUser, verifyUser, confirmUser, loginUser
};