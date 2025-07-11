import { Request, Response } from "express"
import { errHandler } from "../utils/error-handler";
import userModel from "../models/user";
import referralModel from "../models/referral";
import { claimBonusScSchema } from "../utils/validator";
import minerModel from "../models/miner";

const referralDetail = async(req: Request, res: Response):Promise<void> => {
    // get user id stored in the req
    const userId = (req as any).user_id;
    if(! userId) return errHandler(res, "user not identified");

    // check if user still in the db atm
    const userExist = await userModel.findById(userId).select("_id");
    if(! userExist) return errHandler(res, "user not found");
    
    try{
        const referralInfo = await referralModel.findOne({user: userExist?._id}).select('-upline_link');
        if(referralInfo){
            let referralList;
            referralList = await referralModel.find({upline_link: referralInfo.ref_link})
                                                    .select('_id, upline_gain')
                                                    .populate('user', 'first_name last_name -_id');
            if(!referralList || referralList.length === 0) {
                referralList = undefined; 
            }

            res.status(200).json({
                status: "success",
                ref_info: referralInfo,
                ref_list: referralList 
            })
        }
    } catch(err){
        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    }
}

const refBonusClaim = async(req: Request, res: Response):Promise<void> => {
    const { claim_sc } = req.body;

    // get user id stored in the req
    const userId = (req as any).user_id;
    if(! userId) return errHandler(res, "user not identified");

    // check if the claim value is empty
    if(! claim_sc) return errHandler(res, "claim_sc field is required");

    // validate and sanitize user inputs
    const {error, value} = claimBonusScSchema.validate({claim_sc});
    if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

    const refInfo = await referralModel.findOne({user: userId}).select('claim_bonus');
    if(refInfo && refInfo.claim_bonus == 0) return errHandler(res, "there's nothing to claim");

    try{
        if(refInfo){
            const minerInfo = await minerModel.findOne({user: userId}).select('total_mined'); 

            if(minerInfo){
                const bonusToClaim = refInfo.claim_bonus;
                minerInfo.total_mined += bonusToClaim;
                refInfo.claim_bonus = 0

                minerInfo.save();
                refInfo.save();

                res.status(200).json({
                    status: "success",
                    message: `bonus of ${bonusToClaim} SC claimed successfully`
                });
            } 
        }

    } catch(err){
        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    }
}

export { 
    referralDetail, refBonusClaim
}