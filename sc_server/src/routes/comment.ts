import express from 'express';
import { authUser } from '../middlewares/auth-user.js';
import { createComment, deleteComment, updateComment } from '../controllers/comment.js';

const router = express.Router();

router.post('/create-comment', authUser, createComment);
router.delete('/delete/:comment_id', authUser, deleteComment);
router.put('/update/:comment_id', authUser, updateComment);

export {router as commentRoutes}