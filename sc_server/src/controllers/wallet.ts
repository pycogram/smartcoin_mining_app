import { Request, Response} from "express"; 
import { errHandler } from "../utils/error-handler";
import walletModel from "../models/wallet";
import minerModel from "../models/miner";
import historyModel from "../models/history";
import { sendScSchema } from "../utils/validator";
import mongoose from "mongoose";

const sendSc = async(req: Request, res: Response):Promise<void> => {
    const session = await mongoose.startSession();
    try{
        session.startTransaction();

        const { wallet_id, amount_sc } = req.body;

        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        // validate and sanitize user inputs
        const {error, value} = sendScSchema.validate({wallet_id, amount_sc});
        if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

        // check if wallet id is complete
        if(wallet_id.length !== 20) return errHandler(res, "invalid wallet address");

        // check if wallet id exist
        const walletIdExist = await walletModel.findOne({wallet_id}).session(session);
        if(! walletIdExist) return errHandler(res, "wallet address is not found");

        // check if the wallet id belong to the owner
        const walletOwner =  await walletModel.findOne({user: userId, wallet_id});
        if(walletOwner) return errHandler(res, "you can't send to your own wallet address");

        // check if amount is not less than 0
        if(amount_sc < 1) return errHandler(res, "you can only send minimum of 1 SC");

        // check if the amount is not greater than or equal to the avaliable balance
        const currentAmount = await minerModel.findOne({user: userId}).select('total_mined').session(session);
        if(! currentAmount) return errHandler(res, "you cannot perform the transaction now ")

        if( currentAmount && currentAmount.total_mined < amount_sc ) 
            return errHandler(res, `insufficient balance. your current balance is ${currentAmount.total_mined} SC `);

        // get the sender total sent db and update it
        const userWallet = await walletModel.findOne({user: userId})
                                            .select('total_sent') 
                                            .populate('user', 'first_name last_name')
                                            .session(session);

        if(! userWallet) return errHandler(res, "you can't perform the transaction now");

        // credit the receive total_mined db with the amount sent
        const walletAmount = await minerModel.findOne({user: walletIdExist.user})
                                            .select('total_mined')
                                            .populate('user', 'first_name last_name')
                                            .session(session);

        if(! walletAmount) return errHandler(res, "user not found");

        userWallet.total_sent += amount_sc;
        walletAmount.total_mined += amount_sc;
        walletIdExist.total_received += amount_sc;
        currentAmount.total_mined -= amount_sc ;

        await userWallet.save({session}); 
        await walletAmount.save({session}); 
        await walletIdExist.save({session}); 
        await currentAmount.save({session});

        const first_name = (walletAmount.user as any).first_name;
        const last_name = (walletAmount.user as any).last_name;

        const first_name_user = (userWallet.user as any).first_name;
        const last_name_user = (userWallet.user as any).last_name;

        // create a history
        await historyModel.create([{
            user: userId,
            subject: `sent sc`,
            detail: `sent ${amount_sc} SC to ${first_name} ${last_name} successfully`,
            time: new Date()
        }, {
            user: walletIdExist.user,
            subject: `received sc`,
            detail: `received ${amount_sc} SC from ${first_name_user} ${last_name_user} successfully`,
            time: new Date()

        }], {session});

        await session.commitTransaction();

        res.status(200).json({
            status: "success",
            message: `${amount_sc} SC has been sent to ${first_name} ${last_name} successfully`
        });
                
    } catch(err){
        await session.abortTransaction();
        res.status(500).json({
            status: "failed",
            message: `transaction failed. Please try again later`,
            error: `Error occured: ${err as Error}`
        });
    } finally{
        session.endSession();
    }
}

const receiveSc = async(req: Request, res: Response):Promise<void> => {
    try{
        // get user id stored in the req
        const userId = (req as any).user_id;

        if(! userId) return errHandler(res, "user not identified");

        // check if the user has a wallet db
        const walletExist = await walletModel.findOne({user: userId}).select('wallet_id')

        res.status(200).json({
            status: "success",
            message: `${walletExist?.wallet_id}`
        })

    } catch(err){
        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    }
}

const getWalletDetail = async(req: Request, res: Response):Promise<void> => {
    try{
        const { wallet_id} = req.body;

        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        // check if wallet id exist
        const walletIdExist = await walletModel.findOne({wallet_id});
        if(! walletIdExist) return errHandler(res, "wallet address is not found");

        // check if the wallet id belong to the owner
        const walletOwner =  await walletModel.findOne({user: userId, wallet_id});
        if(walletOwner) return errHandler(res, "you can't send to your own wallet address");

        const walletDetail = await walletModel.findOne({user: walletIdExist.user})
                                            .select('total_mined')
                                            .populate('user', 'first_name last_name');

        if(! walletDetail) return errHandler(res, "user not found! check the wallet address");

        const first_name = (walletDetail.user as any).first_name;
        const last_name = (walletDetail.user as any).last_name;

        res.status(200).json({
            status: "success",
            message: `user found! ${first_name} ${last_name}`,
        })

    } catch(err){
        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    }

}

export { sendSc, receiveSc, getWalletDetail }