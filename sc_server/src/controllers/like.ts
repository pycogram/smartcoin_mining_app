import { Request, Response} from "express";
import { errHandler } from "../utils/error-handler.js";
import likeModel from "../models/like.js";
import mongoose from "mongoose";
import userModel from "../models/user.js";

// like
const likePost = async(req: Request, res: Response):Promise<void> => {
    try{
        // destructure req body
        const {post_id} = req.body;

        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        // check if the post id is available
        if(! post_id) return errHandler(res, "something went wrong!");

        // check if liked already
        const likedAlready = await likeModel.findOne({ user: userId, post: post_id });
        if(likedAlready) return errHandler(res, "liked already!");

        const postCreated  = await likeModel.create({
            user: userId, 
            post: new mongoose.Types.ObjectId(post_id), 
        });

        res.status(200).json({
            status: "success",
            message: "post liked",
            data: postCreated
        });
        
    } catch(err){

        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    } 

}
// unlike
const unlikePost = async(req: Request, res: Response):Promise<void> => {
    try{
        // destructure req parameters
        const {post_id} = req.body;

        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        // check if the post id is available
        if(! post_id) return errHandler(res, "something went wrong!");

        // check if unliked already
        const likedAlready = await likeModel.findOne({ user: userId, post: post_id });
        if(!likedAlready) return errHandler(res, "unliked already!");

        // check if the like id exist in the db
        const likeExistId = await likeModel.findOne({ post: post_id, user: userId });

        if(! likeExistId) return errHandler(res, "something went wrong~");

        // // check if the user actually owns the like
        const userExist = await userModel.findById(userId).select("_id");
        const likeOwner = likeExistId.user.equals(userExist?._id);
        if(! likeOwner) return errHandler(res, "unauthorized to perform the action");

        await likeModel.deleteOne({ user: userId, post: post_id });

        res.status(200).json({
            status: "success",
            message: "post unliked"
        });
    } catch(err){

        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    }
}

export {
    likePost, unlikePost
}