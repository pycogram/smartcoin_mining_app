import express from 'express';
import { 
    changePassword, confirmUser, deleteUser, 
    detailUser, forgetPassword, loginUser, newPassword, registerUser, updateUser, verifyUser 
} from '../controllers/user.js';

import { authUser } from '../middlewares/auth-user.js';

const router = express.Router();

// create a user routes
router.post('/register', registerUser);
router.post('/verify', verifyUser);
router.post('/confirm', confirmUser);
router.post('/login', loginUser);
router.get('/', authUser, detailUser);
router.patch('/update', authUser, updateUser);
router.delete('/delete', authUser, deleteUser);
router.patch('/change-password', authUser, changePassword);
router.post('/forgot-password', forgetPassword);
router.post('/new-password', newPassword);

export { router as userRoutes };