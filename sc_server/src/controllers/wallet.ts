import { Request, Response} from "express"; 
import { errHandler } from "../utils/error-handler.js";
import walletModel from "../models/wallet.js";
import minerModel from "../models/miner.js";
import historyModel from "../models/history.js";
import { sendScSchema } from "../utils/validator.js";
import mongoose from "mongoose";

type UserWalletDetailType = {
    first_name: string,
    last_name: string,
    user_name: string
}

const sendSc = async(req: Request, res: Response):Promise<void> => {
    const session = await mongoose.startSession();
    try{
        session.startTransaction();

        const { wallet_id, amount_sc } = req.body;
        console.log(1, typeof amount_sc, amount_sc);

        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        // validate and sanitize user inputs
        const {error, value} = sendScSchema.validate({wallet_id, amount_sc});
        if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

        // check if wallet id is complete
        if(wallet_id.length !== 20) return errHandler(res, "invalid wallet address");

        // check if wallet id exist
        const receiverWalletIDExist = await walletModel.findOne({wallet_id}).session(session);
        if(! receiverWalletIDExist) return errHandler(res, "wallet address is not found");

        // check if the wallet id belong to the owner
        if (receiverWalletIDExist.user.toString() === userId.toString())
        return errHandler(res, "you can't send to your own wallet address");

        // check if amount is not less than 0
        if(amount_sc < 1) return errHandler(res, "you can only send minimum of 1 SC");

        // check if the amount is not greater than or equal to the avaliable balance
        const currentAmount = await minerModel.findOne({user: userId}).select('total_mined').session(session);
        if(! currentAmount) return errHandler(res, "you cannot perform the transaction now ")

        if( currentAmount.total_mined < amount_sc ) 
            return errHandler(res, `insufficient balance. your current balance is ${currentAmount.total_mined} SC `);

        // get the sender total sent db and update it
        const userWallet = await walletModel.findOne({user: userId})
                                            .select('total_sent') 
                                            .populate<{user: UserWalletDetailType}>('user', 'first_name last_name')
                                            .session(session);

        if(! userWallet) return errHandler(res, "you can't perform the transaction now");

        // credit the receiver total_mined db with the amount sent
        const walletAmount = await minerModel.findOne({user: receiverWalletIDExist.user})
                                            .select('total_mined')
                                            .populate<{user: UserWalletDetailType}>('user', 'first_name last_name')
                                            .session(session);

        if(! walletAmount) return errHandler(res, "user not found");

        userWallet.total_sent += amount_sc;
        walletAmount.total_mined += amount_sc;
        receiverWalletIDExist.total_received += amount_sc;
        currentAmount.total_mined -= amount_sc ;

        await userWallet.save({session}); 
        await walletAmount.save({session}); 
        await receiverWalletIDExist.save({session}); 
        await currentAmount.save({session});

        if (!walletAmount.user || typeof walletAmount.user === 'string') {
            throw new Error("walletAmount.user is not populated");
        }

        const {first_name, last_name} = walletAmount.user;

        const {first_name: first_name2, last_name: last_name2} = userWallet.user;

        // create a history
        await historyModel.create([{
            user: userId,
            subject: `sent sc`,
            detail: `sent ${amount_sc} SC to ${first_name} ${last_name} successfully`,
            time: new Date()
        }, {
            user: receiverWalletIDExist.user,
            subject: `received sc`,
            detail: `received ${amount_sc} SC from ${first_name2} ${last_name2} successfully`,
            time: new Date()

        }], {session, ordered: true });

        await session.commitTransaction();

        res.status(200).json({
            status: "success",
            message: `${amount_sc} SC has been sent to ${first_name} ${last_name} successfully`
        });
                
    } catch(err){
        await session.abortTransaction();
        console.error("Error during transaction:", err);
        res.status(500).json({
            status: "failed",
            message: `transaction failed. Please try again later`,
            error: err instanceof Error ? err.message : String(err)
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
        const walletExist = await walletModel.findOne({user: userId}).select('wallet_id total_received total_sent')

        res.status(200).json({
            status: "success",
            message: `${walletExist?.wallet_id}`,
            wallet_info: walletExist
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
                                            .populate<{user: UserWalletDetailType}>('user', 'first_name last_name user_name');

        if(! walletDetail) return errHandler(res, "user not found! check the wallet address");

        const { first_name, last_name, user_name} = walletDetail.user;

        res.status(200).json({
            status: "success",
            message: `${first_name} ${last_name} ~ @${user_name}`,
        })

    } catch(err){
        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    }

}

export { sendSc, receiveSc, getWalletDetail }