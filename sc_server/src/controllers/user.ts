import { Request, Response} from "express"; 
import { errHandler } from "../utils/error-handler.js";
import userModel from "../models/user.js";
import { 
    changePwdSchema, confirmUserSchema, forgetPwdSchema, loginUserSchema, 
    newPwdSchema, registerUserSchema, updateUserSchema, verifyUserSchema 
} from "../utils/validator.js";
import HmacProcess from "../utils/hmac-process.js";
import { PasswordHash, PasswordVerify } from "../utils/password-handler.js";
import mongoose from "mongoose";
import { signUserToken, verifyUserToken } from "../token/tokenized-user.js";
import minerModel from "../models/miner.js";
import referralModel from "../models/referral.js";
import { generateCode, generateUsername } from "../token/generate-code.js";
import walletModel from "../models/wallet.js";
import historyModel from "../models/history.js";
import postModel from "../models/post.js";
import likeModel from "../models/like.js";
import commentModel from "../models/comment.js";
import { nodeMailer } from "../middlewares/send-mail.js";

// register user
const registerUser = async (req: Request, res: Response):Promise<void> => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        //destructure user inputs
        const {first_name, email, password, confirmed_password, upline_link2} = req.body;

        //check if all input are empty
        if(! first_name || ! email || ! password || ! confirmed_password) return errHandler(res, "all fields are required");

        // validate and sanitize user inputs
        const {error} = registerUserSchema.validate({first_name, email, password});
        if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

        // check if password and confirm password are the same
        if(password !== confirmed_password) return errHandler(res, "confirm password does not match");

        //check if email exists
        const emailExist = await userModel.findOne({email});
        if(emailExist) return errHandler(res, "email registered already, please login!");

        // get query string from the reg link and check if it exist in the db
        const uplineLink = upline_link2 as string || req.query.ref as string;

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

        // generate username for user
        const user_name = generateUsername(first_name, 4);

        // hash password
        const hashedPassword = await PasswordHash(password);

        const [ userRegistered ] = await userModel.create(
            [{first_name, user_name, email, password: hashedPassword}], 
            {session}
        );

        // create a history
        await historyModel.create([{
            user: userRegistered._id,
            subject: `account creation`,
            detail: `account created successfully`,
            time: new Date()
        }], {session});

        await session.commitTransaction();

        res.status(200).json({
            status: `success`,
            message: `Your account has been registered succesfully.`,          
            first_name: userRegistered.first_name,
            email: userRegistered.email,
            id: userRegistered._id
        });

    } catch(err){
        await session.abortTransaction();

        res.status(500).json({
            status: `failed`,
            error: `Error occured: ${err as Error}`
        });

    } finally{
        session.endSession();
    }
}
// verify user email by sensding verification code
const verifyUser = async (req: Request, res: Response):Promise<void> => {
    try {
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

        const codeValue = generateCode(6);
        const aboutCode = "Email verification code";
        const expiredTime = 10;
                
        if(! process.env.EMAIL_ADDRESS || !process.env.EMAIL_PASSWORD){
            throw new Error("process.env: EMAIL_ADDRESS || EMAIL_PASSWORD  is not defined");
        }
        const info = await nodeMailer(
            process.env.EMAIL_ADDRESS, process.env.EMAIL_PASSWORD,
            existingUser.email, codeValue, aboutCode, expiredTime
        );

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
                message: "Verification code sent to your email address!"
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
    const session = await mongoose.startSession();
    try{
        session.startTransaction();

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

        if(hashedCodeValue === existingUser.verified_code){
            existingUser.verified = true;
            existingUser.verified_code = undefined;
            existingUser.verified_time = undefined;
            
            await existingUser.save({session});

            // create user's wallet db
            const walletId =  generateCode(20);
            await walletModel.create([{user: existingUser._id, wallet_id: walletId}], {session});

            // create user's mining db
            await minerModel.create([{user: existingUser._id}], {session});

            // create user's ref db
            const refLink = generateCode(12);
            const [referredUser] = await referralModel.create([{user: existingUser._id, ref_link: refLink}], {session});
    
            const uplineExist = await referralModel.findOne({ref_link: req.cookies.upline_link}).session(session);

            const referralBonusToUpline = 30;

            if(uplineExist){
                uplineExist.ref_no += 1;
                uplineExist.claim_bonus += referralBonusToUpline;
                uplineExist.total_bonus += referralBonusToUpline;
                
                // create a history
                await historyModel.create([{
                    user: uplineExist.user,
                    subject: `referral bonus`,
                    detail: `earned ${referralBonusToUpline} SC referral bonus from your ${existingUser.first_name} ${existingUser.last_name}`,
                    time: new Date()
                }], {session});
                
                await uplineExist.save({session});
            }

            if(referredUser && req.cookies.upline_link){
                referredUser.upline_link = req.cookies.upline_link;
                referredUser.upline_gain = 30;
                
                await referredUser.save({session});
                res.clearCookie('upline_link');
            }

            await session.commitTransaction();
            
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
        await session.abortTransaction();

        res.status(500).json({
            status: `failed`,
            error: `Error occured: ${err as Error}`
        });

    } finally {
        session.endSession();
    }


}
//login user
const loginUser = async (req: Request, res: Response):Promise<void> => {
    try{
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
        
        // generate user token
        const signedToken  = signUserToken(userExist._id!);
        if(! signedToken) throw new Error("Error signing user token");

        // create a history
        await historyModel.create([{
            user: userExist._id,
            subject: `account login`,
            detail: `account logged in successfully`,
            time: new Date()
        }]);

        res.cookie('Authorization', 'Bearer ' + signedToken, {
            expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // stores token in the browser for 10days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'

        }).status(200).json({
            status: `success`,
            message: `Logged in successfully`,
            user_id: userExist?._id.toString(),         
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
//detail user
const detailUser = async (req: Request, res: Response):Promise<void> => {
    try{
        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        const userDetail = await userModel.findById({_id: userId});

        res.status(200).json({
            status: 'success',
            data: userDetail
        })

    } catch(err){
        res.status(500).json({
            status: 'failed',
            error: `Error occured: ${err as Error}`
        })
    }
}
//update user
const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user_id;
    if (!userId) return errHandler(res, "User not identified");

    const { first_name, last_name, user_name, email } = req.body;

    let pdp_url = req.body.pdp_url || ""; 

    if (req.file && req.file.path) {
      pdp_url = req.file.path; // new uploaded image URL from Cloudinary
    }

    // all fields are required
    if (!first_name || !last_name || !user_name)
      return errHandler(res, "All fields are required");

    // validate input
    const {error, value} = updateUserSchema.validate({ first_name, last_name, user_name });
    if (error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

    const userDetail = await userModel.findById(userId).select("first_name last_name user_name");
    if (!userDetail) return errHandler(res, "user info not available at the moment");

    // Prepare update object
    const updateData: any = {};
    if (userDetail.first_name !== first_name) updateData.first_name = first_name;
    if (userDetail.last_name !== last_name) updateData.last_name = last_name;
    if (userDetail.user_name !== user_name) updateData.user_name = user_name;
    updateData.pdp_url = pdp_url;

    if (Object.keys(updateData).length === 0)
      return errHandler(res, "No changes made yet");

    // Check if username is being changed and if it's taken
    const userNameExist = await userModel.findOne({ user_name });
    if (userNameExist && ! userNameExist._id.equals(userId)) 
        return errHandler(res, "username is taken already. Choose another");
    
    await userDetail.updateOne(updateData);

    const updatedInfo = { 
        first_name, last_name, user_name, email, pdp_url
    }

    res.status(200).json({
      status: "success",
      message: "User data updated successfully",
      data: updatedInfo
    });

  } catch (err) {
    res.status(500).json({
      status: "failed",
      error: `Error occurred: ${(err as Error).message}`,
    });
  }
};
//delete account 
const deleteUser = async (req: Request, res: Response):Promise<void> => {
    try{
        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");
        
        // Check if userId is present and valid
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) 
        return errHandler(res, "user not identified or invalid ID");

        const objectUserId = new mongoose.Types.ObjectId(userId);

        await Promise.all([
            historyModel.deleteMany({ user: objectUserId }),
            minerModel.deleteOne({ user: objectUserId }),
            postModel.deleteMany({ user: objectUserId }),
            commentModel.deleteMany({ user: objectUserId }),
            likeModel.deleteMany({ user: objectUserId }),
            referralModel.deleteMany({ user: objectUserId }),
            walletModel.deleteOne({ user: objectUserId })
        ]);

        await userModel.findByIdAndDelete(userId);
        res.status(200).json({
            status: 'success',
            message: 'user and all related data deleted successfully'
        });

    } catch(err){
        res.status(500).json({
            status: 'failed',
            error: `Failed to delete user data..`
        })
    }
}
//change password
const changePassword = async (req: Request, res: Response):Promise<void> => {
    try{
        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");
        
        // Check if userId is present and valid
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) 
        return errHandler(res, "user not identified or invalid ID");

        //destructure user inputs
        const {old_pwd, new_pwd, confirmed_pwd} = req.body;

        //check if all input are empty
        if(! old_pwd || ! new_pwd || ! confirmed_pwd) return errHandler(res, "all fields are required");

        // validate and sanitize user inputs
        const {error} = changePwdSchema.validate({old_pwd, new_pwd});
        if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

        // check if password and confirm password are the same
        if(new_pwd !== confirmed_pwd) return errHandler(res, "confirm password does not match");

        if(old_pwd === new_pwd) return errHandler(res, "no changes made yet");

        const existingUser = await userModel.findById(userId).select('+password');

        if(!existingUser) return errHandler(res, "user does not exists");

        if(! existingUser.verified) return errHandler(res, "user not verified yet");

        const validatePwd = await PasswordVerify(old_pwd, existingUser.password!);

        if(! validatePwd) return errHandler(res, "old password is incorrect");

        const hashPassword = await PasswordHash(new_pwd);

        existingUser.password = hashPassword;

        await existingUser.save();

        res.status(200).json({                                                                                                                                                                                                                                                  
            success: "success",
            message: 'Password updated'
        });
            
    } catch(err){
        res.status(500).json({
            status: 'failed',
            error: `Error occurred: ${(err as Error).message}`
        })
    }


}
// forget password
const forgetPassword = async (req: Request, res: Response):Promise<void> => {
    try{
        //destructure user inputs
        const {email} = req.body;

        //check if all input are empty
        if(! email) return errHandler(res, "email is required");

        // validate and sanitize user inputs
        const {error} = forgetPwdSchema.validate({email});
        if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

        const existingUser = await userModel.findOne({email}).select('+forget_pwdt');
        if(!existingUser) return errHandler(res, "user does not exist");

        //user can only request a code after after 5mins
        if(existingUser?.forget_pwdt){
            const timePassed = Date.now() - existingUser.forget_pwdt;
            const waitTime = 5 * 60 * 1000;
            
            if(timePassed < waitTime){

                const timeLeft = waitTime - timePassed;
                const min = Math.floor(timeLeft / 60000);
                const sec = Math.floor((timeLeft % 60000) / 1000);

                return errHandler(res, `A link has been sent to your email address. Please wait after ${min} minute(s) and ${sec} seconds before requesting for another link`);
            }
        }

        const defaultRegLink  = `${req.protocol}://${req.get('host')}`;

        const genCode = generateCode(15);
        const codeValue = `${defaultRegLink}/new-password?link=${genCode}`;
        const aboutCode = "Forget password link";
        const expiredTime = 30;
                
        if(! process.env.EMAIL_ADDRESS || !process.env.EMAIL_PASSWORD){
            throw new Error("process.env: EMAIL_ADDRESS || EMAIL_PASSWORD  is not defined");
        }
        const info = await nodeMailer(
            process.env.EMAIL_ADDRESS, process.env.EMAIL_PASSWORD,
            existingUser.email, codeValue, aboutCode, expiredTime
        );
        if(info.accepted[0] === existingUser.email){
            if(! process.env.EMAIL_VERIFICATION_CODE_SECRET){
                throw new Error("process.env.EMAIL_VERIFICATION_CODE_SECRET is not defined");
            }
            const hashedCodeValue = HmacProcess(genCode, process.env.EMAIL_VERIFICATION_CODE_SECRET);

            existingUser.forget_pwdc = hashedCodeValue.toString();

            existingUser.forget_pwdt = Date.now();

            await existingUser.save();

            res.cookie('Email', email, {
                expires: new Date(Date.now() + 1 * 60 * 60 * 1000), 
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            }).status(200).json({
                status: "success",
                message: "Forgot password link has been sent to your email address. Please check your inbox or spam box "
            });

        } else {
            res.status(500).json({
                status: "failed",
                message: 'Link failed to send!'
            });
        }

    } catch(err){
        res.status(500).json({
            status: `failed`,
            error: `Error occured: ${err as Error}`
        });
    } 
}
// reset password
const newPassword = async (req: Request, res: Response):Promise<void> => {
    try{
        // grab the email from either req header or cookie based on the environment
        let getEmail = req.headers.client === 'not-browser' 
                    ? req.headers.authorization 
                    : req.cookies['Email'];

        if (!getEmail) {
            return errHandler(res, "session expired. please request for a new forgot password link");
        }

        let email =  getEmail;  
            
        //destructure user inputs
        const {password, confirmed_password, forget_pwdc} = req.body;

        //check if all input are empty
        if(! password || ! confirmed_password) return errHandler(res, "all fields are required");

        // validate and sanitize user inputs
        const {error} = newPwdSchema.validate({password});
        if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

        // check if password and confirm password are the same
        if(password !== confirmed_password) return errHandler(res, "confirm password does not match");

        // get query string from the reg link and check if it exist in the db
        const pwdLink = forget_pwdc as string || req.query.link as string;
        
        if(!pwdLink || pwdLink.length != 15) return errHandler(res, `link incomplete. you can't process this action`);

        const existingUser = await userModel.findOne({email}).select('+forget_pwdt +forget_pwdc +password');
        if(!existingUser) return errHandler(res, "user does not exist");

        if(! process.env.EMAIL_VERIFICATION_CODE_SECRET){
            throw new Error("process.env.EMAIL_VERIFICATION_CODE_SECRET is not defined");
        }
        const resetLink = pwdLink.toString();
        const hashedCodeValue = HmacProcess(resetLink, process.env.EMAIL_VERIFICATION_CODE_SECRET);

        if(hashedCodeValue !== existingUser.forget_pwdc) return errHandler(res, "Invalid forget password link - The link used does not match the link sent to your email")
         
        const matchedPassword = await PasswordVerify(password, existingUser.password!);
        if(matchedPassword) return errHandler(res, "you cannot use old password as new password");

        const hashedNewPassword = await PasswordHash(password);

        if(Date.now() - existingUser.forget_pwdt! > 30 * 60 * 1000) return errHandler(res, "link already expired. please request for new one!");

        const isVerified  = existingUser.verified;

        if(hashedCodeValue === existingUser.forget_pwdc){
            existingUser.verified  = true;
            existingUser.password = hashedNewPassword;
            existingUser.forget_pwdc = undefined;
            existingUser.forget_pwdt = undefined;

            await existingUser.save();

            res.clearCookie('Email').status(200).json({                                                                                                                                                                                                                                                  
                status: "success",
                email,
                message: isVerified ? 'Password reset successfully, You can now login!' : 'Password reset and email account verified successfully, You can now login!'
            })
        } else {

            res.status(400).json({                                                                                                                                                                                                                                                  
                status: "failed",
                message: 'The unexpected occured!'
            })
        }

    } catch(err){
        res.status(500).json({
            status: `failed`,
            error: `Error occured: ${err as Error}`
        });
    } 
}

export {
    registerUser, verifyUser, confirmUser, loginUser,
    detailUser, updateUser, deleteUser, changePassword,
    forgetPassword, newPassword
}
