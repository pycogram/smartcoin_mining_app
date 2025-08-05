import express from 'express';
import { createPost, deletePost, updatePost, viewAllPost, viewPostDetail} from '../controllers/post.js';
import { authUser } from '../middlewares/auth-user.js';

const router = express.Router();

// create post routes

router.post('/create', authUser, createPost);
router.delete('/delete', authUser, deletePost);
router.put('/update', authUser, updatePost);
router.get('/view-all', authUser, viewAllPost);
router.post('/view-detail', authUser,  viewPostDetail)

export { router as postRoutes };