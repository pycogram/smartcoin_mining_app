import { Request, Response} from "express"; 
import { errHandler } from "../utils/error-handler.js";
import postModel from "../models/post.js";
import { postSchema } from "../utils/validator.js";
import mongoose from "mongoose";
import userModel from "../models/user.js";
import commentModel from "../models/comment.js";
import likeModel from "../models/like.js";
import minerModel from "../models/miner.js";

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
                                        .select('content createdAt _id user post')
                                        .sort({createdAt: "desc"})
                                        .populate('user', 'first_name last_name user_name email _id');

        if (!viewPost.length) return errHandler(res, "no posts found!");
        const postIds = viewPost.map(post => post._id);

        const allComments = await commentModel.find({ post: { $in: postIds } });
        if (!allComments.length) return errHandler(res, "no comment found!");

        const commentsByPostId: Record<string, any[]> = {};
        allComments.forEach(comment => {
            if (!comment.post) return;
            const key = comment.post.toString();
            if(!commentsByPostId[key]) commentsByPostId[key] = [];
            commentsByPostId[key].push(comment);
        });

        const postsWithComments = viewPost.map(post => {
            const postId = post._id.toString();
            return {...post.toObject(), comments: commentsByPostId[postId] || []}
        })
        
        res.status(200).json({
            status: "success",
            user_id: userExist?._id,
            message: "post fetched successfully",
            data: postsWithComments
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
                                            .select('content createdAt _id')
                                            .sort({createdAt: "desc"})
                                            .populate('user', 'first_name last_name user_name email _id');

        if (!viewPosts.length) return errHandler(res, "no posts found!");

        const postIds = viewPosts.map(post => post._id);
        const userIds = viewPosts.map(post2 => post2.user._id);

        const allLevels = await minerModel.find({user: {$in: userIds}})                                                
                                                .select('user total_mined total_locked');                                      
                                                
        const allComments = await commentModel.find({ post: { $in: postIds } })
                                                .select('content createdAt _id user post')
                                                .sort({createdAt: "desc"})
                                                .populate('user', 'first_name last_name user_name email _id');

        const commentsByPostId: Record<string, any[]> = {};
        allComments.forEach(comment => {
            if (!comment.post) return;
            const key = comment.post.toString();
            if(!commentsByPostId[key]) commentsByPostId[key] = [];
            commentsByPostId[key].push(comment);
        });

        const allLikes = await likeModel.find({ post: { $in: postIds } })
                                        .select('_id user post')
                                        .populate('user', 'first_name last_name user_name email _id');

        const likesByPostId: Record<string, any[]> = {};
        allLikes.forEach(like => {
            if (!like.post) return;
            const key = like.post.toString();
            if (!likesByPostId[key]) likesByPostId[key] = [];
            likesByPostId[key].push(like);
        });

        const postsWithCommentsLikes = viewPosts.map(post => {
            const postId = post._id.toString();
            const comments = commentsByPostId[postId] || [];
            const likes = likesByPostId[postId] || [];
            const liked = likes.some(like => like.user._id.toString() === userId.toString());
            const minerInfo = allLevels.find(level => level.user.toString() === post.user._id.toString());
            const totalMined = minerInfo ? minerInfo.total_mined : 0;
            const totalLocked = minerInfo ? minerInfo.total_locked : 0;

            return {
                ...post.toObject(), 
                commentCount: comments ? comments.length : 0,
                likeCount: likes ? likes.length : 0,
                likedByUser: liked,
                allLevel: totalMined + totalLocked
            }
        });

        res.status(200).json({
            status: "success",
            message: "all posts fetched successfully",
            data: postsWithCommentsLikes
        });
    } catch(err){
        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    }
}
// get post with all engagements
const viewPostDetail = async(req: Request, res: Response):Promise<void> => {
    try{
        // get user id stored in the req
        const userId = (req as any).user_id;
        if(! userId) return errHandler(res, "user not identified");

        const {post_id} = req.body;

        const viewPost = await postModel.findById(new mongoose.Types.ObjectId(post_id))
            .select('content createdAt _id')
            .populate('user', 'first_name last_name user_name email _id');

        if (!viewPost) return errHandler(res, "no posts found!");

        const allLevel = await minerModel.findOne({user: viewPost.user._id})                                                
                                         .select('total_mined total_locked');

        const allComments = await commentModel.find({ post: viewPost._id })
            .select('content createdAt _id user post')
            .sort({ createdAt: "asc" })
            .populate('user', 'first_name last_name user_name email _id');

        const allLikes = await likeModel.find({ post: viewPost._id })
            .select('_id user post')
            .populate('user', 'first_name last_name user_name email _id');

        const liked = allLikes.some(like => like.user._id.toString() === userId.toString());

        // attach comment and like counts to the post
        const postWithCommentsLikes = {
            ...viewPost.toObject(),
            comments: allComments,
            likes: allLikes,
            commentCount: allComments.length,
            likeCount: allLikes.length,
            likedByUser: liked,
            level: allLevel && allLevel.total_mined + allLevel.total_locked
        };

        res.status(200).json({
            status: "success",
            message: "post with engagements fetched successfully",
            data: postWithCommentsLikes
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
    try{
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

        const postCreated  = await postModel.create({user: userId, content});

        res.status(200).json({
            status: "success",
            message: "post created successfully",
            data: postCreated
        });
        
    } catch(err){

        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    } 

}
// delete post
const deletePost = async(req: Request, res: Response):Promise<void> => {
    try{
        // destructure req parameters
        const {postId} = req.body;

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
        const userExist = await userModel.findById(userId).select("_id");
        const postOwner = postExist.user.equals(userExist?._id);
        if(! postOwner) return errHandler(res, "unauthorized to delete post");

        await postExist.deleteOne({_id: (userExist as any).user});

        res.status(200).json({
            status: "success",
            message: "post deleted!"
        });
    } catch(err){

        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    }
}
// update post
const updatePost = async(req: Request, res: Response):Promise<void> => {
    try{
        // destructure req body
        const {postId, content} = req.body;

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
        const postExist = await postModel.findById({_id: postId});
        if(! postExist) return errHandler(res, "post not found");

        // check if changes were made before updating the post
        if(postExist.content === content) return errHandler(res, "no changes made yet");

        // check if the user actually owns the post
        const userExist = await userModel.findById(userId).select("_id");
        const postOwner = postExist.user.equals(userExist?._id);
        if(! postOwner) return errHandler(res, "unauthorized to update post");

        await postExist.updateOne({content});

        res.status(200).json({
            status: "success",
            message: 'post updated'
        });
    } catch(err){
        
        res.status(500).json({
            status: "failed",
            error: `Error occured: ${err as Error}`
        })
    } 
}

export {
    createPost, deletePost, updatePost, 
    viewPost, viewAllPost, viewPostDetail
}