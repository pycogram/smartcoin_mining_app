import express from 'express';
import { createPost, deletePost, updatePost, viewAllPost, viewPost, viewPostDetail} from '../controllers/post.js';
import { authUser } from '../middlewares/auth-user.js';

const router = express.Router();

// create post routes

router.post('/create-post', authUser, createPost);
router.delete('/delete/:post_id', authUser, deletePost);
router.put('/update/:post_id', authUser, updatePost);
router.get('/view', authUser, viewPost);
router.get('/view-all', authUser, viewAllPost);
router.post('/view-detail', authUser,  viewPostDetail)

export { router as postRoutes };