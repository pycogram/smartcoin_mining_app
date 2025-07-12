import { Request, Response} from "express"; 
import { errHandler } from "../utils/error-handler";
import postModel from "../models/post";
import { postSchema } from "../utils/validator";
import mongoose, { startSession } from "mongoose";
import userModel from "../models/user";
import historyModel from "../models/history";

// get post by user by one's id
const viewPost = async(req: Request, res: Response):Promise<void> => {
    try{
        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        // check if user still in the db atm
        const userExist = await userModel.findById(userId).select("_id");
        if(! userExist) return errHandler(res, "user not found");
        
        const viewPost = await postModel.find({user: userExist?._id})
                                        .select("-user_id")
                                        .sort({createdAt: "descending"});
        
        res.status(200).json({
            status: "success",
            user_id: userExist?._id,
            message: "post fetched successfully",
            data: viewPost
        });
    } catch(err){
        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    }

}
// get all users' posts
const viewAllPost = async(req: Request, res: Response):Promise<void> => {
    try{
    // get user id stored in the req
    const userId = (req as any).user_id;
    if(! userId) return errHandler(res, "user not identified");

    const viewPosts = await postModel.find()
                                        .select('content -_id')
                                        .sort({createdAt: "desc"})
                                        .populate('user', 'first_name last_name email -_id');

    res.status(200).json({
        status: "success",
        message: "all posts fetched successfully",
        data: viewPosts
    });
    } catch(err){
        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    }
}
// create post
const createPost = async(req: Request, res: Response):Promise<void> => {
    const session = await mongoose.startSession();
    try{
        session.startTransaction();

        // destructure req body
        const {content} = req.body;

        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        // check if the content post is empty
        if(! content) return errHandler(res, "content field is required");

        // validate and sanitize user inputs
        const {error, value} = postSchema.validate({content});
        if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

        const postCreated  = await postModel.create({user: userId, content}, {session});

        // create a history
        await historyModel.create({
            user: userId,
            subject: `post`,
            detail: `created a new post`,
            time: new Date()
        }, {session});

        await session.commitTransaction();

        res.status(200).json({
            status: "success",
            message: "post created successfully",
            data: postCreated
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
// delete post
const deletePost = async(req: Request, res: Response):Promise<void> => {
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        
        // destructure req parameters
        const {post_id: postId} = req.params;

        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        // check if the post id is available
        if(! postId) return errHandler(res, "post id is not available");

        // check if the post id is moogoose type and valid
        if(! mongoose.Types.ObjectId.isValid(postId))
            return errHandler(res, `post id (${postId}) is invalid`);

        // check if the post id exist in the db
        const postExist = await postModel.findById({_id: postId});
        if(! postExist) return errHandler(res, "post not found");

        // check if the user actually owns the post
        const userExist = await userModel.findById(userId).select("_id").session(session);
        const postOwner = postExist.user.equals(userExist?._id);
        if(! postOwner) return errHandler(res, "unauthorized to delete post");

        await postModel.deleteOne({_id: (userExist as any).user}, {session});

        // create a history
        await historyModel.create({
            user: userId,
            subject: `post`,
            detail: `deleted a post`,
            time: new Date()
        }, {session});

        await session.commitTransaction();

        res.status(200).json({
            status: "success",
            message: "post deleted!"
        });
    } catch(err){
        await session.abortTransaction();

        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })

    } finally{
        session.endSession();
    }
}
// update post
const updatePost = async(req: Request, res: Response):Promise<void> => {
    const session = await mongoose.startSession();
    try{
        session.startTransaction();

        // destructure req parameters to get post id in the url
        const {post_id: postId} = req.params;

        // destructure req body
        const {content} = req.body;

        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        // check if the post id is available
        if(! postId) return errHandler(res, "post id is not available");

        // check if the post id is moogoose type and valid
        if(! mongoose.Types.ObjectId.isValid(postId))
            return errHandler(res, `post id (${postId}) is invalid`);

        // check if the content post is empty
        if(! content) return errHandler(res, "content field is required");

        // validate and sanitize user inputs
        const {error, value} = postSchema.validate({content});
        if(error) return errHandler(res, error.details[0].message.replace(/"/g, ""));

        // check if the post id exist in the db
        const postExist = await postModel.findById({_id: postId}).session(session);
        if(! postExist) return errHandler(res, "post not found");

        // check if changes were made before updating the post
        if(postExist.content === content) return errHandler(res, "no changes made yet");

        // check if the user actually owns the post
        const userExist = await userModel.findById(userId).select("_id");
        const postOwner = postExist.user.equals(userExist?._id);
        if(! postOwner) return errHandler(res, "unauthorized to update post");

        await postExist.updateOne({content}, {session});

        // create a history
        await historyModel.create({
            user: userId,
            subject: `post`,
            detail: `updated a post`,
            time: new Date()
        }, {session});

        await session.commitTransaction();

        res.status(200).json({
            status: "success",
            message: 'post updated'
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
    createPost, deletePost, updatePost, viewPost, viewAllPost
}