import { Request, Response} from "express"; 
import minerModel from "../models/miner";
import { errHandler } from "../utils/error-handler";
import { lockScSchema, unLockScSchema } from "../utils/validator";
import { format } from 'date-fns';

const lockSc = async(req: Request, res: Response):Promise<void> => {
    const { lock_sc, lock_period } = req.body;

    // get user id stored in the req
    const userId = (req as any).user_id;
    if(! userId) return errHandler(res, "user not identified");

    // validate and sanitize user inputs
    const {error, value} = lockScSchema.validate({lock_sc, lock_period});
    if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

    const minerInfo = await minerModel.findOne({user: userId});

    // check if the miner has enough balance
    if( minerInfo && lock_sc > minerInfo?.total_mined) 
        return errHandler(res, `figure should exceed your available balance (${minerInfo.total_mined})`);

    // check if the figure is greater than or equal to one
    if(minerInfo && lock_sc <= 0)
        return errHandler(res, "figure should be minimum of one");

    // check if lock period is greater than or equal to 1 hr
    if(minerInfo && lock_period < 1)
        return errHandler(res, "lock period should be minimum of one hour");

    try{
        // check if user has an active lock then marge with the cuurent lock time
        let setNewLock: boolean = true;
        const lockTime = new Date();

        if(minerInfo && minerInfo.unlock_time){
            setNewLock = false;
            const now = Date.now();
            const currentUnlock = new Date(minerInfo.unlock_time).getTime();
            const remainingLockTime =  Math.max(currentUnlock - now, 0);
            const newLockDuration =  lock_period * 60 * 60 * 1000;
            const updatedUnlockTime = new Date(now + remainingLockTime + newLockDuration);
            minerInfo.unlock_time = updatedUnlockTime;

        } else {

            if(minerInfo){
                const lockDuration = lock_period *  60 * 60 * 1000; // hour(s) * minute(s) * second(s) * milisecond(s)
                const unlockTime = new Date(new Date().getTime() + lockDuration);
                minerInfo.unlock_time = unlockTime;
            }
        }
        
        if(minerInfo){
            minerInfo.total_mined -= lock_sc;
            const addReward = 10/100 * lock_sc * lock_period; // so here, the higher your lock time, the greater the bonus
            minerInfo.total_locked += (addReward + lock_sc);
            minerInfo.lock_time = lockTime;

            const minerSc = await minerInfo.save();

            res.status(200).json({
                status: "success",
                message: setNewLock ? `${addReward} SC bonus gets added to ${lock_sc} SC (lock amount) . And total of ${minerInfo.total_locked} SC gets unlocked by ${format(minerInfo?.unlock_time!, "EEEE, MMMM do yyyy, h:mm:ss a")}`
                                    : `${addReward} SC bonus gets added to ${lock_sc} SC (lock amount). And total of ${minerInfo.total_locked} SC gets unlocked with the new unlock time: ${format(minerInfo?.unlock_time!, "EEEE, MMMM do yyyy, h:mm:ss a")}`,
                minerSc
            });
        }

    } catch(err){
        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        });
    }
}

const unLockSc = async(req: Request, res: Response):Promise<void> => {
    const { unlock_sc } = req.body;

    // get user id stored in the req
    const userId = (req as any).user_id;
    if(! userId) return errHandler(res, "user not identified");

    // validate and sanitize user inputs
    const {error, value} = unLockScSchema.validate({unlock_sc});
    if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

    const minerInfo = await minerModel.findOne({user: userId});

    //check if there's lock
    if(minerInfo && ! minerInfo.lock_time && ! minerInfo.unlock_time){
        return errHandler(res, "no SC currently locked");
    }
    
    //check if unlock duration has reached
    if(minerInfo && minerInfo.lock_time && minerInfo.unlock_time){
        const now = Date.now();
        const unlockTime = new Date(minerInfo.unlock_time).getTime();

        if(now <= unlockTime) 
            return errHandler(res, `lock session still active. you can unlock by ${format(unlockTime, "EEEE, MMMM do yyyy, h:mm:ss a")} `);
    }

    try{

        if(minerInfo){
            const unLockedSc = minerInfo.total_locked;
            minerInfo.total_mined += unLockedSc;
            minerInfo.total_locked -= unLockedSc;
            minerInfo.lock_time = undefined;
            minerInfo.unlock_time = undefined;

            await minerInfo.save();

            res.status(500).json({
                status: "success",
                message: `total of ${unLockedSc} SC were retured. your new total balance is ${minerInfo.total_locked}`
            });
        }

    } catch(err){
        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        });
    }
}

export { lockSc, unLockSc }