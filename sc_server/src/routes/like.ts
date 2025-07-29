import express from 'express';
import { authUser } from '../middlewares/auth-user.js';
import { likePost, unlikePost } from '../controllers/like.js';

const router = express.Router();

router.post('/create-like', authUser, likePost);
router.delete('/un-like', authUser, unlikePost);

export {router as likeRoutes}