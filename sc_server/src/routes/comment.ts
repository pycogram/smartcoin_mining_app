import express from 'express';
import { authUser } from '../middlewares/auth-user.js';
import { createComment, deleteComment, updateComment } from '../controllers/comment.js';

const router = express.Router();

router.post('/create', authUser, createComment);
router.delete('/delete', authUser, deleteComment);
router.put('/update', authUser, updateComment);

export {router as commentRoutes}