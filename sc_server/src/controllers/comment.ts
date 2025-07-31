import { Request, Response} from "express"; 
import { errHandler } from "../utils/error-handler.js";
import commentModel from "../models/comment.js";
import mongoose from "mongoose";
import { commentSchema } from "../utils/validator.js";
import userModel from "../models/user.js";


// create comment
const createComment = async(req: Request, res: Response):Promise<void> => {
    try{
        // destructure req body
        const {post_id, comment} = req.body;

        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        // check if the content post is empty
        if(! comment) return errHandler(res, "comment field is required");

        // check if the post id is available
        if(! post_id) return errHandler(res, "something went wrong!");

        // validate and sanitize user inputs
        const {error, value} = commentSchema.validate({comment});
        if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

        const postCreated  = await commentModel.create({
            user: userId, 
            post: new mongoose.Types.ObjectId(post_id), 
            content: comment
        });

        res.status(200).json({
            status: "success",
            message: "comment created successfully",
            data: postCreated
        });
        
    } catch(err){

        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    } 

}
// delete comment
const deleteComment = async(req: Request, res: Response):Promise<void> => {
    try{
        // destructure req parameters
        const {commentId} = req.body;

        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        // check if the post id is available
        if(! commentId) return errHandler(res, "post id is not available");

        // check if the post id is moogoose type and valid
        if(! mongoose.Types.ObjectId.isValid(commentId))
            return errHandler(res, `post id (${commentId}) is invalid`);

        // check if the post id exist in the db
        const commentExist = await commentModel.findById({_id: commentId});
        if(! commentExist) return errHandler(res, "comment not found");

        // check if the user actually owns the post
        const userExist = await userModel.findById(userId).select("_id");
        const commentOwner = commentExist.user.equals(userExist?._id);
        if(! commentOwner) return errHandler(res, "unauthorized to delete comment");

        await commentExist.deleteOne({_id: (userExist as any).user});

        res.status(200).json({
            status: "success",
            message: "comment deleted!"
        });
    } catch(err){

        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    }
}
// update comment
const updateComment = async(req: Request, res: Response):Promise<void> => {
    try{
        // destructure req parameters to get comment id in the url

        // destructure req body
        const {commentId, comment} = req.body;

        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        // check if the post id is available
        if(! commentId) return errHandler(res, "post id is not available");

        // check if the post id is moogoose type and valid
        if(! mongoose.Types.ObjectId.isValid(commentId))
            return errHandler(res, `post id (${commentId}) is invalid`);

        // check if the content post is empty
        if(! comment) return errHandler(res, "comment field is required");

        // validate and sanitize user inputs
        const {error, value} = commentSchema.validate({comment});
        if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

        // check if the post id exist in the db
        const commentExist = await commentModel.findById({_id: commentId});
        if(! commentExist) return errHandler(res, "post not found");

        // check if changes were made before updating the post
        if(commentExist.content === comment) return errHandler(res, "no changes made yet");

        // check if the user actually owns the post
        const userExist = await userModel.findById(userId).select("_id");
        const commentOwner = commentExist.user.equals(userExist?._id);
        if(! commentOwner) return errHandler(res, "unauthorized to update comment");

        await commentExist.updateOne({content: comment});

        res.status(200).json({
            status: "success",
            message: 'comment updated'
        });
    } catch(err){
        
        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    } 
}

export {
    createComment, deleteComment, updateComment
}