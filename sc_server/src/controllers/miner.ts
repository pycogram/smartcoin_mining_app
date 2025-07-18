import { Request, Response} from "express"; 
import { errHandler } from "../utils/error-handler";
import { mineScSchema } from "../utils/validator";
import minerModel from "../models/miner";
import { format } from 'date-fns';
import referralModel from "../models/referral";
import historyModel from "../models/history";
import mongoose from "mongoose";

const dashboard = async(req: Request, res: Response):Promise<void> => {
    try{
        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        const minerInfo = await minerModel.findOne({user: userId}).select('total_mined total_locked start_time end_time lock_time unlock_time');
        if(! minerInfo) return errHandler(res, "user not found");

        const currentTime = Date.now();
        const endTime =  new Date ((minerInfo as any).end_time).getTime();
        //if(currentTime < endTime ) return errHandler(res, "mining still in progress");

        res.status(200).json({
            status: "success",
            message: "miner info fetched successfully",
            data: minerInfo
        });
    } catch(err){
        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    }
}

const mineSc = async(req: Request, res: Response):Promise<void> => {
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
    
        const { mine_sc } = req.body;

        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        // check if the mine value is empty
        if(! mine_sc) return errHandler(res, "mine_sc field is required");

        // validate and sanitize user inputs
        const {error, value} = mineScSchema.validate({mine_sc});
        if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

        const minerInfo = await minerModel.findOne({user: userId}).session(session);
        if(! minerInfo) return errHandler(res, "user not found");
        
        //check if mining endtime has passed a specific duration
        if(minerInfo && minerInfo.end_time && minerInfo.start_time){
            const now = Date.now();
            const endTime = new Date(minerInfo.end_time).getTime();

            if(now <= endTime) 
                return errHandler(res, `mining session still active and it ends by ${format(endTime, "mm:ss a")} `);
        }

        const miningRate = 30;
        const miningDuration = 30 * 60 * 1000; //  minute(s) * second(s) * milisecond(s)
        const startTime = new Date();
        const endTime = new Date(new Date().getTime() + miningDuration);

        if(minerInfo){
            minerInfo.total_mined += miningRate;
            minerInfo.start_time = startTime;
            minerInfo.end_time = endTime;
        
            await minerInfo.save({session});

            // create a history
            await historyModel.create([{
                user: userId,
                subject: `mine sc`,
                detail: `started mining and it ends by ${format(endTime,  "EEEE, MMMM do yyyy, h:mm:ss a")}`,
                time: new Date()
            }], {session});
        }

        // check if the miner has an upline (inviter)
        const refInfo = await referralModel.findOne({user: userId}).select('upline_link upline_gain').session(session);

        if(refInfo && refInfo.upline_gain){
            const miningBonusToUpline = 50/100 * miningRate;
            refInfo.upline_gain += miningBonusToUpline;

            const uplineInfo = await referralModel.findOne({ref_link: refInfo.upline_link}).session(session);
    
            if(uplineInfo){ 
                uplineInfo.total_bonus += miningBonusToUpline;
                uplineInfo.claim_bonus += miningBonusToUpline;

                await refInfo.save({session});
                await uplineInfo.save({session});

                const first_name = (minerInfo.user as any).first_name;
                const last_name = (minerInfo.user as any).last_name;

                // create a history
                await historyModel.create([{
                    user: uplineInfo.user,
                    subject: `referral bonus`,
                    detail: `you earned ${miningBonusToUpline} referral mining bonus from ${first_name} ${last_name}`,
                    time: new Date()
                }], {session});
            }
        }

        await session.commitTransaction();

        res.status(200).json({
            status: "success",
            message: `mining activated and will end by ${format(endTime,  "EEEE, MMMM do yyyy, h:mm:ss a")}`,
            data: minerInfo
        });
    } catch(err){
        await session.abortTransaction();

        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    } finally {
        session.endSession();
    }
}

export {
    dashboard, mineSc 
}